import { NextRequest, NextResponse } from "next/server";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

type WindowState = {
  count: number;
  resetAt: number;
};

type RateLimitConfig = {
  timeWindowInMs: number;
  maxRequests: number;
  keyPrefix?: string;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, WindowState>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  return "unknown";
}

function cleanupExpiredEntries(now: number) {
  for (const [key, state] of rateLimitStore.entries()) {
    if (state.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(request: NextRequest, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const ip = getClientIp(request);
  const prefix = config.keyPrefix ?? "api";
  const key = `${prefix}:${request.method}:${request.nextUrl.pathname}:${ip}`;

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.timeWindowInMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  const nextCount = existing.count + 1;
  existing.count = nextCount;
  rateLimitStore.set(key, existing);

  const remaining = Math.max(0, config.maxRequests - nextCount);
  const success = nextCount <= config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining,
    resetAt: existing.resetAt,
  };
}

export async function createRateLimitResponse(
  result: RateLimitResult,
  request: NextRequest,
) {
  const lang = getLocaleFromRequest(request);
  const dict = await getDictionary(lang);
  const serverTime = Date.now();
  const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAt - serverTime) / 1000));
  const errorText = dict.statusCodes.TOO_MANY_REQUESTS;
  const messageText = dict.errors.rateLimit.TOO_MANY_REQUESTS.replace("{seconds}", String(retryAfterSeconds));

  function formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = pad(date.getDate());
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? "+" : "-";
    const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const tzMinutes = pad(Math.abs(tzOffset) % 60);
    return `${day}-${month}-${year}:${hours}:${minutes}:${seconds} ${sign}${tzHours}${tzMinutes}`;
  }

  const logEntry = `
[${formatTimestamp(new Date())}]
URL: ${request?.url ?? "NO URL"}
Method: ${request?.method ?? "UNKNOWN"}
Status: 429
Error: TOO_MANY_REQUESTS
Message: ${messageText}
-----------------------------
`;

  console.error(logEntry);

  return NextResponse.json(
    {
      status: 429,
      error: errorText,
      message: messageText,
      rateLimit: {
        retryAfterSeconds,
        resetAt: result.resetAt,
        serverTime,
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.resetAt),
      },
    },
  );
}