'use client'

import { useEffect, useState } from "react";
import { useLang } from '@/hooks/useLang'
import axios from "axios";
import type { Dictionary } from "@/app/i18n";

export interface Event {
  [key: string]: any;
}

export function useEvents(dict: Dictionary) {
  const lang = useLang();
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/events?lang=${lang}`);
        if (res.status !== 200) throw new Error(dict.events.errors.FAILED_TO_FETCH_EVENTS, { cause: res.status });
        const data = res.data;
        console.log(data)
        setEvents(data.response);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || dict.events.errors.FAILED_TO_FETCH_EVENTS;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return { events, loading, error };
}
