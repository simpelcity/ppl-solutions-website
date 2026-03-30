'use client'

import { useEffect, useState } from "react";

export interface Event {
  [key: string]: any;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/events");
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
