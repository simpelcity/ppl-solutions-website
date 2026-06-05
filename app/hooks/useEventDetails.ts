'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import type { Dictionary } from "@/app/i18n";
import { parseApiError, useRateLimitState } from "@/hooks/useRateLimitState";


export function useEventDetails(dict: Dictionary, eventId: string) {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isRateLimited, rateLimitSecondsRemaining, clearRateLimitCountdown, applyRateLimit } = useRateLimitState();

  const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      clearRateLimitCountdown();
      try {
        const res = await axios.get(`/api/events/detail/${eventId}`);
        if (res.status !== 200) throw new Error(dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS, { cause: res.status });
        const data = res.data;
        setEvent(data.response);
      } catch (err: any) {
        const parsed = parseApiError(err, dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS);
        setError(parsed.message);
        applyRateLimit(parsed.rateLimit);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  return { event, loading, error, isRateLimited, rateLimitSecondsRemaining, retryEventDetails: fetchEventDetails };
}
