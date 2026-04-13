'use client'

import type { Dictionary } from "@/app/i18n"
import { useEventDetails } from '@/hooks/useEventDetails'
import { Card, Col, Row, Image, Container, Table } from 'react-bootstrap'
import { BsCalendar3, BsHddStack, BsDownload } from "react-icons/bs";
import { FaRegClock, FaRegUser } from "react-icons/fa6";
import { LuTruck, LuGamepad2 } from "react-icons/lu";
import { FiMapPin, FiExternalLink } from "react-icons/fi";
import { IoLanguage } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { DivEvents, BSButton, LoaderSpinner } from "@/components";
import ReactMarkdown from 'react-markdown';
import axios from "axios";

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

  function formatDate(dateString: Date) {
    if (!dateString) return `${dict.errors.events.NA}`;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
  };

  function formatFullDate(dateString: Date) {
    if (!dateString) return `${dict.errors.events.NA}`;
    const utcString = dateString.toString()
    const isoString = utcString.replace(" ", "T") + "Z";
    const date = new Date(isoString);
    const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
    const datePart = date.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "long", year: "numeric" });
    return datePart + " " + time;
  };

  function formatTime(dateString: Date) {
    if (!dateString) return `${dict.errors.events.NA}`;
    const utcString = dateString.toString()
    const isoString = utcString.replace(" ", "T") + "Z";
    const date = new Date(isoString);
    const hours = date.getHours().toLocaleString().padStart(2, "0");
    const minutes = date.getMinutes().toLocaleString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <Col xs={12} md={11} xl={10}>
        <Card className="bg-dark text-light rounded-0 border-0 shadow-sm">
          <Card.Img variant="top" src={event.banner || "https://placehold.co/1920x500?text=No+Banner"} alt={event.name} className="rounded-0" loading="lazy" />
          <Card.Body className="d-flex flex-column align-items-center">
            <Card.Title className="fs-1 mb-3">{event.name}</Card.Title>
            <div className="mb-3">
              <div className="d-flex align-items-center gap-1">
                <BsCalendar3 /><strong>{dict.events.card.date}: </strong>
                <span>{formatDate(event.meetup_at)}</span>
              </div>
            </div>

            <Row className="w-100 mb-3 row-gap-3">
              <Col xs={12} md={6} className="d-flex flex-column align-items-center align-items-md-end">
                <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <LuTruck /><strong>Departure city: </strong>
                  </div>
                  {event.departure.city ?? `${dict.errors.events.NA}`}
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <FiMapPin /><strong>Destination city: </strong>
                  </div>
                  {event.arrive.city ?? `${dict.errors.events.NA}`}
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column align-items-center align-items-md-start">
                <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <LuTruck /><strong>Departure location: </strong>
                  </div>
                    {event.departure.location ?? `${dict.errors.events.NA}`}
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <FiMapPin /><strong>Destination location: </strong>
                  </div>
                  {event.arrive.location ?? `${dict.errors.events.NA}`}
                </div>
              </Col>
            </Row>
            <Row className="w-100 mb-3">
              <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end">
                <div className="d-flex align-items-center gap-1">
                  <FaRegClock /><strong>{dict.events.card.meetupTime}: </strong>
                  {formatTime(event.meetup_at)}
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start">
                <div className="d-flex align-items-center gap-1">
                  <FaRegClock /><strong>{dict.events.card.departureTime}: </strong>
                  {formatTime(event.start_at)}
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-1">
                <IoLanguage /><strong>Main language: </strong>
                {event.language ?? `${dict.errors.events.NA}`}
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                <span className="d-flex align-items-center gap-1"><MdOutlineKeyboardVoice /><strong>Communication: </strong></span>
                {event.voice_link ? (
                  <a href={event.voice_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link">
                    {event.voice_link}
                  </a>
                ) : (
                  <span>No communication</span>
                )}
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                <span className="d-flex align-items-center gap-1"><FiExternalLink /><strong>External link: </strong></span>
                {event.external_link ? (
                  <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link">
                    {event.external_link}
                  </a>
                ) : (
                  <span>No external link</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-1">
                <LuGamepad2 /><strong>{dict.events.card.game}: </strong>
                {event.game ?? `${dict.errors.events.NA}`}
              </div>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <BsHddStack /><strong>{dict.events.card.server}: </strong>
                {event.server?.name ?? `${dict.errors.events.NO_SERVER}`}
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex flex-column align-items-center text-start">
                <h2>Event Rules</h2>
                <ReactMarkdown>{event.rule}</ReactMarkdown>
              </div>
            </div>
            <div className="mb-3">
              <h2 className="d-flex align-items-center justify-content-center gap-1">
                <LuTruck /><span>VTCs Attending ({event.attendances.confirmed_vtcs.length})</span>
              </h2>
              {event.attendances.confirmed_vtcs.length > 0 ? (
                <Row className="mb-3 row-gap-4">
                  {event.attendances.confirmed_vtcs.map((vtc: any) => (
                    <Col key={vtc.id} xs={12} md={6} lg={4}>
                      <div className="bg-dark-subtle shadow-sm p-2 h-100 d-flex align-items-center justify-content-center">
                        <a href={`https://truckersmp.com/vtc/${vtc.id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link">
                          {vtc.name}
                        </a>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div>No VTCs have confirmed attendance yet.</div>
              )}
            </div>
            <div className="mb-3">
              <h2 className="d-flex align-items-center justify-content-center gap-1">
                <FaRegUser /><span>Attending ({event.attendances.confirmed_users.length})</span>
              </h2>
              {event.attendances.confirmed_users.length > 0 ? (
                <Row className="mb-3 row-gap-4">
                  {event.attendances.confirmed_users.map((user: any) => (
                    <>
                      <Col key={user.id} xs={12} md={6} lg={4}>
                        <div className="bg-dark-subtle shadow-sm p-2 h-100 d-flex align-items-center justify-content-center">
                          <a href={`https://truckersmp.com/user/${user.id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link">
                            {user.username}
                          </a>
                        </div>
                      </Col>
                    </>
                  ))}
                </Row>
              ) : (
                <div>No Users have confirmed attendance yet.</div>
              )}
            </div>
            {/* <img src={getPfp("2718433")} /> */}
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}
