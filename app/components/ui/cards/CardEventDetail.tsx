'use client'

import { useEffect, useState } from "react";
import type { Dictionary } from "@/app/i18n"
import { useEventDetails } from '@/hooks/useEventDetails'
import { Card, Col, Row, Collapse, Placeholder } from 'react-bootstrap'
import { BsHddStackFill } from "react-icons/bs";
import { FaUser, FaAngleRight, FaAngleDown, FaTruck, FaClock } from "react-icons/fa6";
import { FaMapMarkerAlt } from 'react-icons/fa'
import { FiExternalLink, FiDownload } from "react-icons/fi";
import { IoLanguage, IoCalendar, IoGameController } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import { BSButton } from "@/components";
import ReactMarkdown from 'react-markdown';
import { useIsAdmin } from "@/lib/useIsAdmin";

type Props = {
  eventId: string;
  dict: Dictionary;
}

export default function CardEventDetail({ eventId, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #00fbff; font-weight: bold;", ...args);
  };

  const { event, loading, error } = useEventDetails(dict, eventId);
  const [vtcsOpen, setVtcsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  
  const detailDict = dict.events.details.card;
  const detailErrorDict = dict.errors.events.details;

  const serverName = event?.server.name;
  if (serverName === "To be determined") event.server.name = dict.events.card.toBeDetermined;
  else if (serverName === "Event Server") event.server.name = dict.events.card.eventServer;

  adminLog(event)

  if (loading) {
    return (
      <Col xs={12} md={11} xl={10} className="px-3">
        <Card className="bg-dark text-light rounded-0 border-0 shadow-sm">
          <Card.Body className="d-flex flex-column align-items-center">
            <div className="mb-3">
              <div>
                <Placeholder animation="glow" className="d-flex gap-1">
                  <Placeholder className="rounded-1" style={{ width: 80, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 130, height: 20 }} />
                </Placeholder>
              </div>
            </div>

            <Row className="mb-4 row-gap-3 w-100">
              <Col xs={12} md={6} className="d-flex flex-column align-items-center align-items-md-end gap-3">
                <div className="d-flex flex-wrap flex-column flex-md-row align-items-center column-gap-1">
                  <div >
                    <Placeholder animation="glow" className="d-flex gap-1">
                      <Placeholder className="rounded-1" style={{ width: 160, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 60, height: 20 }} />
                    </Placeholder>
                  </div>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                  <div>
                    <Placeholder animation="glow" className="d-flex gap-1">
                      <Placeholder className="rounded-1" style={{ width: 170, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 60, height: 20 }} />
                    </Placeholder>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column align-items-center align-items-md-start gap-3">
                <div className="d-flex flex-wrap flex-column flex-md-row align-items-center column-gap-1">
                  <div>
                    <Placeholder animation="glow" className="d-flex gap-1">
                      <Placeholder className="rounded-1" style={{ width: 200, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 60, height: 20 }} />
                    </Placeholder>
                  </div>
                </div>
                <div className="d-flex flex-wrap flex-column flex-md-row align-items-center column-gap-1">
                  <div>
                    <Placeholder animation="glow" className="d-flex gap-1">
                      <Placeholder className="rounded-1" style={{ width: 210, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 60, height: 20 }} />
                    </Placeholder>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="mb-4 w-100">
              <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end">
                <div>
                  <Placeholder animation="glow" className="d-flex gap-1">
                    <Placeholder className="rounded-1" style={{ width: 150, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 60, height: 20 }} />
                  </Placeholder>
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start">
                <div>
                  <Placeholder animation="glow" className="d-flex gap-1">
                    <Placeholder className="rounded-1" style={{ width: 180, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 60, height: 20 }} />
                  </Placeholder>
                </div>
              </Col>
            </Row>
            <div className="mb-4 d-flex flex-column gap-3">
              <div>
                <Placeholder animation="glow" className="d-flex gap-1">
                  <Placeholder className="rounded-1 ms-auto" style={{ width: 170, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 70, height: 20 }} />
                </Placeholder>
              </div>
              <div className="d-flex justify-content-center">
                <Placeholder animation="glow" className="d-flex gap-1">
                  <Placeholder className="rounded-1" style={{ width: 170, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 200, height: 20 }} />
                </Placeholder>
              </div>
              <div className="d-flex justify-content-center">
                <Placeholder animation="glow" className="d-flex gap-1">
                  <Placeholder className="rounded-1" style={{ width: 150, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 200, height: 20 }} />
                </Placeholder>
              </div>
            </div>
            <div className="mb-4 d-flex flex-column gap-3">
              <div>
                <Placeholder animation="glow" className="d-flex gap-1">
                  <Placeholder className="rounded-1 ms-auto" style={{ width: 80, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 50, height: 20 }} />
                </Placeholder>
              </div>
              <div>
                <Placeholder animation="glow" className="d-flex gap-1">
                  <Placeholder className="rounded-1 ms-auto" style={{ width: 90, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 110, height: 20 }} />
                </Placeholder>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex flex-column align-items-center text-start">
                <Placeholder animation="glow" className="d-flex gap-1 fs-2">
                  <Placeholder className="rounded-1 ms-auto" style={{ width: 90, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 90, height: 20 }} />
                </Placeholder>
              </div>
            </div>
            <div className="mb-4 w-100">
              <Placeholder animation="glow" className="d-flex gap-1 fs-2 mb-3">
                <Placeholder className="rounded-1 ms-auto" style={{ width: 120, height: 20 }} /><Placeholder className="rounded-1" style={{ width: 160, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 60, height: 20 }} />
              </Placeholder>
              <Placeholder.Button variant="primary" className="rounded-1" xs={2} />
            </div>
            <div className="mb-4 w-100">
              <Placeholder animation="glow" className="d-flex gap-1 fs-2 mb-3">
                <Placeholder className="rounded-1 ms-auto" style={{ width: 190, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 60, height: 20 }} />
              </Placeholder>
              <Placeholder.Button variant="primary" className="rounded-1" xs={2} />
            </div>
            <div className="mb-4 w-100">
              <Placeholder animation="glow" className="d-flex gap-1 fs-2 mb-3">
                <Placeholder className="rounded-1 ms-auto" style={{ width: 120, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 90, height: 20 }} />
              </Placeholder>
              <Col xs={12} md={6} lg={4} className="mx-auto">
                <div className="bg-dark-lighter shadow-sm py-0 p-lg-2 h-100 d-flex align-items-center justify-content-center">
                  <Placeholder animation="glow" className="d-flex gap-1 w-100 px-5 py-1">
                    <Placeholder className="rounded-1 ms-auto" style={{ width: 100, height: 20 }} /><Placeholder className="rounded-1 me-auto" style={{ width: 60, height: 20 }} />
                  </Placeholder>
                </div>
              </Col>
            </div>
            <div>
              <Placeholder.Button variant="primary" className="rounded-1" style={{ width: 240 }} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
  }
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

  function timeAgo(dateString: Date) {
    if (!dateString) return `${dict.errors.events.NA}`;
    const utcString = dateString.toString()
    const isoString = utcString.replace(" ", "T") + "Z";
    const date: any = new Date(isoString);
    const today: any = new Date();
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    
    if (seconds < 60) {
      const value = seconds;
      const unit = "second";
      const text = `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      return text;
    } else if (minutes < 60) {
      const value = minutes;
      const unit = "minute";
      const text = `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      return text;
    } else if (hours < 24) {
      const value = hours;
      const unit = "hour";
      const text = `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      return text;
    } else if (days < 7) {
      const value = days;
      const unit = "day";
      const text = `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      return text;
    } else if (weeks < 5) {
      const value = weeks;
      const unit = "week";
      const text = `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      return text;
    } else if (months < 12) {
      const value = months;
      const unit = "month";
      const text = `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
      return text;
    } else return formatFullDate(dateString);
  }

  function dlcs(dlcObject: object) {
    if (!dlcObject) return `${dict.errors.events.NO_DLC}`;
    const arr = Object.values(dlcObject);
    return arr;
  }

  function dlcKeys(dlcObject: object) {
    if (!dlcObject) return `${dict.errors.events.NO_DLC}`;
    const entries = Object.entries(dlcObject);
    return (
      <Row className="mb-3 row-gap-4 d-flex justify-content-center">
        {entries.map(([id, name]) => (
          <Col key={id} xs={12} md={6} lg={4}>
            <div className="bg-dark-lighter shadow-sm py-0 p-lg-2 h-100 d-flex align-items-center justify-content-center">
              <a href={`https://store.steampowered.com/app/${id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link px-5 py-2 p-lg-0 fw-bold">
                {name}
              </a>
            </div>
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <>
      <Col xs={12} md={11} xl={10}>
        <Card className="bg-dark text-light rounded-0 border-0 shadow-sm">
          <Card.Body className="d-flex flex-column align-items-center">
            <div className="mb-3">
              <div className="d-flex align-items-center gap-1">
                <IoCalendar /><strong>{dict.events.card.date}: </strong>
                <span>{formatDate(event.meetup_at)}</span>
              </div>
            </div>

            <Row className="mb-3 row-gap-3 w-100">
              <Col xs={12} md={6} className="d-flex flex-column align-items-center align-items-md-end">
                <div className="d-flex flex-wrap flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <FaTruck /><strong>{detailDict.departureCity}: </strong>
                  </div>
                  {event.departure.city ?? `${dict.errors.events.NA}`}
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex flex-wrap align-items-center gap-1">
                    <FaMapMarkerAlt /><strong>{detailDict.destinationCity}: </strong>
                  </div>
                  {event.arrive.city ?? `${dict.errors.events.NA}`}
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex flex-column align-items-center align-items-md-start">
                <div className="d-flex flex-wrap flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <FaTruck /><strong>{detailDict.departureLocation}: </strong>
                  </div>
                  {event.departure.location ?? `${dict.errors.events.NA}`}
                </div>
                <div className="d-flex flex-wrap flex-column flex-md-row align-items-center column-gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <FaMapMarkerAlt /><strong>{detailDict.destinationLocation}: </strong>
                  </div>
                  <span>{event.arrive.location ?? `${dict.errors.events.NA}`}</span>
                </div>
              </Col>
            </Row>
            <Row className="mb-3 w-100">
              <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end">
                <div className="d-flex align-items-center gap-1">
                  <FaClock /><strong>{dict.events.card.meetupTime}: </strong>
                  {formatTime(event.meetup_at)}
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start">
                <div className="d-flex align-items-center gap-1">
                  <FaClock /><strong>{dict.events.card.departureTime}: </strong>
                  {formatTime(event.start_at)}
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-1">
                <IoLanguage /><strong>{detailDict.mainLanguage}: </strong>
                {event.language ?? `${dict.errors.events.NA}`}
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                <span className="d-flex align-items-center gap-1"><MdKeyboardVoice /><strong>{detailDict.communication}: </strong></span>
                {event.voice_link ? (
                  <a href={event.voice_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link">
                    {event.voice_link}
                  </a>
                ) : (
                  <span>{detailErrorDict.NO_COMMUNICATION_LINK}</span>
                )}
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center column-gap-1">
                <span className="d-flex align-items-center gap-1"><FiExternalLink /><strong>{detailDict.externalLink}: </strong></span>
                {event.external_link ? (
                  <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link">
                    {event.external_link}
                  </a>
                ) : (
                  <span>{detailErrorDict.NO_EXTERNAL_LINK}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-1">
                <IoGameController /><strong>{dict.events.card.game}: </strong>
                {event.game ?? `${dict.errors.events.NA}`}
              </div>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <BsHddStackFill /><strong>{dict.events.card.server}: </strong>
                {event.server.name ?? `${dict.errors.events.NO_SERVER}`}
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex flex-column align-items-center text-start">
                <h2>{detailDict.eventRules}</h2>
                <ReactMarkdown>{event.rule}</ReactMarkdown>
              </div>
            </div>
            <div className="mb-3 w-100">
              <h2 className="d-flex align-items-center justify-content-center gap-1">
                <FaTruck /><span>{detailDict.vtcsAttending} ({event.attendances.confirmed_vtcs.length})</span>
              </h2>
              {event.attendances.confirmed_vtcs.length > 0 ? (
                <>
                  <BSButton
                    variant="outline"
                    onClick={() => setVtcsOpen(!vtcsOpen)}
                    aria-controls="vtcs-collapse-menu"
                    aria-expanded={vtcsOpen}
                    classes={vtcsOpen ? "mb-3" : ""}>
                    {vtcsOpen ? (
                      <>
                        <div className="d-flex align-items-center gap-1">
                          <span>{detailDict.hideVTCs}</span><FaAngleRight className="rotate-90-cw" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-1">
                          <span>{detailDict.showVTCs}</span><FaAngleDown className="rotate-90-ccw" />
                        </div>
                      </>
                    )}
                  </BSButton>
                  <Collapse in={vtcsOpen}>
                    <Row id="vtcs-collapse-menu" className={`mb-3 row-gap-4 ${vtcsOpen ? "d-flex justify-content-center" : "justify-content-center"}`}>
                      {event.attendances.confirmed_vtcs.map((vtc: any) => (
                        <Col key={vtc.id} xs={12} md={6} lg={4}>
                          <div className="bg-dark-lighter shadow-sm p-2 h-100 d-flex flex-column align-items-center justify-content-center">
                            <a href={`https://truckersmp.com/vtc/${vtc.id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link fw-bold">
                              {vtc.name}
                            </a>
                            <small className="text-gray">{timeAgo(vtc.updated_at)}</small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Collapse>
                </>
              ) : (
                <p className="text-warning">{detailErrorDict.NO_CONFIRMED_VTCS}</p>
              )}
            </div>
            <div className="mb-3 w-100">
              <h2 className="d-flex align-items-center justify-content-center gap-1">
                <FaUser /><span>{detailDict.usersAttending} ({event.attendances.confirmed_users.length})</span>
              </h2>
              {event.attendances.confirmed_users.length > 0 ? (
                <>
                  <BSButton
                    variant="outline"
                    onClick={() => setUsersOpen(!usersOpen)}
                    aria-controls="users-collapse-menu"
                    aria-expanded={usersOpen}
                    classes={usersOpen ? "mb-3" : ""}>
                    {usersOpen ? (
                      <>
                        <div className="d-flex align-items-center gap-1">
                          <span>{detailDict.hideUsers}</span><FaAngleRight className="rotate-90-cw" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-1">
                          <span>{detailDict.showUsers}</span><FaAngleDown className="rotate-90-ccw" />
                        </div>
                      </>
                    )}
                  </BSButton>
                  <Collapse in={usersOpen}>
                    <Row id="users-collapse-menu" className={`mb-3 row-gap-4 ${usersOpen ? "d-flex justify-content-center": "justify-content-center"}`}>
                      {event.attendances.confirmed_users.map((user: any) => (
                        <Col key={user.id} xs={12} md={6} lg={4}>
                          <div className="bg-dark-lighter shadow-sm p-2 h-100 d-flex flex-column align-items-center justify-content-center">
                            <a href={`https://truckersmp.com/user/${user.id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary event-link fw-bold">
                              {user.username}
                            </a>
                            <small className="text-gray">{timeAgo(user.updated_at)}</small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Collapse>
                </>
              ) : (
                <p className="text-warning">{detailErrorDict.NO_CONFIRMED_USERS}</p>
              )}
            </div>
            <div className="mb-3 w-100">
              <h2 className="d-flex align-items-center justify-content-center gap-1">
                <FiDownload /><span>{detailDict.eventDLCs}</span>
              </h2>
              {dlcs(event.dlcs).length > 0 ? (
                <>
                  {dlcKeys(event.dlcs)}
                </>
              ) : (
                <p className="text-warning">{detailErrorDict.NO_DLCS}</p>
              )}
            </div>
            <div>
              <BSButton variant="primary" href={`https://truckersmp.com/events/${event.slug}`} target="_blank" rel="noopener noreferrer" classes="d-flex gap-1">
                <span>{detailDict.viewOnTruckersmp}</span> <FiExternalLink className="fs-5" />
              </BSButton>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}
