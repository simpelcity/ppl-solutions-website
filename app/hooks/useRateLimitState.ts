"use client";

import { useEffect, useState } from "react";

export type RateLimitPayload = {
  retryAfterSeconds?: number;
  resetAt?: number;
  serverTime?: number;
};

export type ParsedApiError = {
  message: string;
  rateLimit?: RateLimitPayload;
};

export function parseApiError(err: any, fallbackMessage: string): ParsedApiError {
  const message = err?.response?.data?.message || err?.message || fallbackMessage;
  const payloadRateLimit = err?.rateLimit || err?.response?.data?.rateLimit;

  const headerReset = Number(err?.response?.headers?.["x-ratelimit-reset"]);
  const headerRetryAfter = Number(err?.response?.headers?.["retry-after"]);

  const rateLimit: RateLimitPayload | undefined = payloadRateLimit ?? (
    Number.isFinite(headerReset) || Number.isFinite(headerRetryAfter)
      ? {
        resetAt: Number.isFinite(headerReset) ? headerReset : Date.now() + (headerRetryAfter * 1000),
        retryAfterSeconds: Number.isFinite(headerRetryAfter) ? headerRetryAfter : undefined,
        serverTime: Date.now(),
      }
      : undefined
  );

  return { message, rateLimit };
}

export function useRateLimitState() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [rateLimitSecondsRemaining, setRateLimitSecondsRemaining] = useState<number | null>(null);

  const clearRateLimitCountdown = () => {
    setIsRateLimited(false);
    setRateLimitResetAt(null);
    setRateLimitSecondsRemaining(null);
  };

  const applyRateLimit = (rateLimit?: RateLimitPayload) => {
    const resetAt = rateLimit?.resetAt
      ?? (rateLimit?.retryAfterSeconds ? Date.now() + rateLimit.retryAfterSeconds * 1000 : undefined);

    if (!resetAt) {
      clearRateLimitCountdown();
      return false;
    }

    const initialSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    setIsRateLimited(true);
    setRateLimitResetAt(resetAt);
    setRateLimitSecondsRemaining(initialSeconds);
    return true;
  };

  useEffect(() => {
    if (!rateLimitResetAt) return;

    let intervalId: number;

    const tick = () => {
      const seconds = Math.max(0, Math.ceil((rateLimitResetAt - Date.now()) / 1000));
      setRateLimitSecondsRemaining(seconds);

      if (seconds <= 0) {
        window.clearInterval(intervalId);
      }
    };

    tick();
    intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [rateLimitResetAt]);

  return {
    isRateLimited,
    rateLimitSecondsRemaining,
    clearRateLimitCountdown,
    applyRateLimit,
  };
}