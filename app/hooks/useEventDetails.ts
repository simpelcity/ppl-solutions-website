'use client'

import { useEffect, useState } from "react";
import { useLang } from '@/hooks/useLang'
import axios from "axios";
import type { Dictionary } from "@/app/i18n";


export function useEventDetails(dict: Dictionary, eventId: string) {
  const lang = useLang();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/events/detail?eventId=${eventId}&lang=${lang}`);
        if (res.status !== 200) throw new Error(dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS, { cause: res.status });
        const data = res.data;
        setEvent(data.response);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, []);

  return { event, loading, error };
}
