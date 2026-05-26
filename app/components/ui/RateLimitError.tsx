"use client";

import { BSButton } from "@/components";
import type { Dictionary } from "@/app/i18n";

type Props = {
  dict: Dictionary;
  secondsRemaining: number;
  onRetry: () => void;
  retryLoading?: boolean;
};

export default function RateLimitError({
  dict,
  secondsRemaining,
  onRetry,
  retryLoading = false,
}: Props) {
  const countdown = Math.max(0, secondsRemaining);
  const message = dict.errors.rateLimit.TOO_MANY_REQUESTS.replace("{seconds}", String(countdown));
  const canRetry = countdown === 0 && !retryLoading;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center row-gap-3 text-danger fw-bold">
      <div>
        {dict.errors.GENERAL_ERROR}: {message}
      </div>

      <BSButton variant="primary" onClick={onRetry} disabled={!canRetry}>
        {dict.errors.rateLimit.TRY_AGAIN}
      </BSButton>
    </div>
  );
}