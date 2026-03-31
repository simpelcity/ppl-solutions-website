'use client'

import { useEffect, useState } from "react";
import { useLang } from '@/hooks/useLang'

export interface Event {
  [key: string]: any;
}

export function useEvents() {
  const lang = useLang();
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/events?lang=${lang}`);
        console.log(response)
        if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
        const data = await response.json();
        setEvents(Object.values(data.response));
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setEvents(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return { events, loading, error };
}
