'use client'

import type { Dictionary } from "@/app/i18n"
import { useEventDetails } from '@/hooks/useEventDetails'
import { Card, Col } from 'react-bootstrap'

type Props = {
  eventId: string;
  dict: Dictionary;
}

export default function CardEventDetail({ eventId, dict }: Props) {
  const { event, loading, error } = useEventDetails(dict, eventId);
  console.log(event)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!event) return <div>No event data found.</div>

  return (
    <>
      <h1>Event {eventId}</h1>
      <h2>{event.name}</h2>
      {event.attendances.confirmed_vtcs.map((vtc: any) => (
        <p>{vtc.name}</p>
      ))}
    </>
  )
}
