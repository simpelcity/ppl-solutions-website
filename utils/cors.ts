import type { NextRequest, NextResponse } from "next/server";

const DEFAULT_ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const DEFAULT_ALLOWED_HEADERS = "Content-Type, Authorization";
const DEFAULT_MAX_AGE_SECONDS = "86400";

function getAllowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS ?? "")
    .split(", ")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveAllowedOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;

  const allowedOrigins = getAllowedOrigins();
  console.log("Allowed Origins:", allowedOrigins);
  if (allowedOrigins.length === 0) return null;
  if (allowedOrigins.includes("*")) return "*";

  return allowedOrigins.includes(requestOrigin) ? requestOrigin : null;
}

export function getCorsContext(request: NextRequest) {
  const explicitOrigin = request.headers.get("origin");
  const requestOrigin = explicitOrigin ?? request.nextUrl.origin;
  const allowedOrigin = resolveAllowedOrigin(requestOrigin);
  const requestedHeaders = request.headers.get("access-control-request-headers");

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": DEFAULT_ALLOWED_METHODS,
    "Access-Control-Allow-Headers": requestedHeaders || DEFAULT_ALLOWED_HEADERS,
    "Access-Control-Max-Age": DEFAULT_MAX_AGE_SECONDS,
    Vary: "Origin, Access-Control-Request-Headers",
  };

  if (allowedOrigin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  const hasOriginHeader = Boolean(explicitOrigin);
  const isAllowedOrigin = Boolean(allowedOrigin);

  return {
    hasOriginHeader,
    isAllowedOrigin,
    headers,
  };
}

export function applyCorsHeaders(response: NextResponse, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
