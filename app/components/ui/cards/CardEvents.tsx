'use client'

import { Col, Card, CardImg, CardBody, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Placeholder } from "react-bootstrap";
import { BsCalendar3 } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa6";
import { LuTruck } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import { LuGamepad2 } from "react-icons/lu";
import { BsHddStack } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { DivEvents, BSButton, LoaderSpinner } from "@/components";
import type { Dictionary } from "@/app/i18n"
import { useEvents } from "@/hooks/useEvents";


type PageProps = {
  dict: Dictionary;
}

export default function CardEvents({ dict }: PageProps) {
  const { events, loading, error } = useEvents(dict);

  if (loading) {
    return (
      <Col xs={12} md={6} xl={4}>
        <Card className="bg-dark text-light rounded-0 border-0 shadow-sm text-start">
          <Card.Img as={Placeholder} variant="top" className="rounded-0" animation="glow">
            <Placeholder xs={12} style={{ height: "91px" }} />
          </Card.Img>
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow" className="fs-4 mb-3">
              <Placeholder xs={12} className="rounded-1" />
            </Placeholder>
            <div className="mb-3">
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={3} className="rounded-1" /><Placeholder xs={5} className="rounded-1" />
              </Placeholder>
            </div>
            <div className="mb-3 d-flex flex-column gap-2">
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={6} className="rounded-1" /><Placeholder xs={2} className="rounded-1" />
              </Placeholder>
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={7} className="rounded-1" /><Placeholder xs={2} className="rounded-1" />
              </Placeholder>
            </div>
            <div className="mb-3 d-flex flex-column gap-2">
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={5} className="rounded-1" /><Placeholder xs={3} className="rounded-1" />
              </Placeholder>
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={6} className="rounded-1" /><Placeholder xs={3} className="rounded-1" />
              </Placeholder>
            </div>
            <div className="mb-3 d-flex flex-column gap-2">
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={3} className="rounded-1" /><Placeholder xs={2} className="rounded-1" />
              </Placeholder>
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={4} className="rounded-1" /><Placeholder xs={4} className="rounded-1" />
              </Placeholder>
              <Placeholder animation="glow" className="d-flex gap-1">
                <Placeholder xs={3} className="rounded-1" /><Placeholder xs={4} className="rounded-1" />
              </Placeholder>
            </div>
            <Placeholder.Button variant="primary" className="rounded-1 pt-2 pb-3" xs={4} />
          </Card.Body>
        </Card>
      </Col>
    )
  }

  if (error) {
    return (
      <div className="text-center text-light">
        <div className="text-danger fw-bold fs-4">{error}</div>
      </div>
    );
  }

  if (!events) return null;

  if (events.length === 0) {
    return (
      <div className="text-center text-light">
        <div className="fw-bold fs-4 d-flex justify-content-center align-items-center column-gap-2">{dict.errors.events.NO_EVENTS} <BsCalendar3 /></div>
      </div>
    );
  }

  function formatDate(dateString: Date) {
    if (!dateString) return `${dict.errors.events.NA}`;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  function formatTime(dateString: Date) {
    if (!dateString) return `${dict.errors.events.NA}`;
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  function dlcs(dlcObject: object) {
    if (!dlcObject) return `${dict.errors.events.NO_DLC}`;
    const arr = Object.values(dlcObject);
    return arr;
  }

  function dlcDiv(dlcObject: object) {
    const dlcArray = Object.values(dlcObject);
    const keys = Object.keys(dlcObject);
    return (
      <Dropdown>
        <Dropdown.Toggle className="p-0 text-decoration-none ms-1 bg-transparent border-0 text-primary fw-bold my-auto">
          +{dlcArray.length - 1} {dict.events.card.more}
        </Dropdown.Toggle>
        <Dropdown.Menu variant="dark" className="bg-dark shadow-sm">
          {dlcArray.slice(1).map((dlc: any, index: number) => (
            <Dropdown.Item key={index} href={`https://store.steampowered.com/app/${keys[index]}`} target="_blank" rel="noopener noreferrer" className="text-primary fw-bold">{dlc}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function dlcKeys(dlcObject: object) {
    if (!dlcObject) return `${dict.errors.events.NO_DLC}`;
    const dlcArray = Object.values(dlcObject);
    const keys = Object.keys(dlcObject);
    const entries = Object.entries(dlcObject);
    return keys || null;
  }

  return (
    <>
      {events.map((event: any) => {
        return (
          <Col xs={12} md={6} xl={4} key={event.id}>
            <Card className="bg-dark text-light rounded-0 border-0 shadow-sm">
              <Card.Img
                variant="top"
                className="rounded-0"
                src={event.banner || "https://placehold.co/1920x500?text=No+Banner"}
                alt={event.name}
                loading="lazy"
              />
              <Card.Body className="d-flex flex-column align-items-stretch align-items-md-start">
                <Card.Title className="fs-4 mb-3 text-start">{event.name}</Card.Title>
                <DivEvents>
                  <div className="d-flex align-items-center gap-1">
                    <BsCalendar3 /><strong>{dict.events.card.date}: </strong>
                    {formatDate(event.meetup_at)}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div className="d-flex align-items-center gap-1">
                    <FaRegClock /><strong>{dict.events.card.meetupTime}: </strong>
                    {formatTime(event.meetup_at)}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FaRegClock /><strong>{dict.events.card.departureTime}: </strong>
                    {formatTime(event.start_at)}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div className="d-flex align-items-center gap-1">
                    <LuTruck /><strong>{dict.events.card.departureLocation}: </strong>
                    {event.departure?.city ?? `${dict.errors.events.NA}`}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FiMapPin /><strong>{dict.events.card.destinationLocation}: </strong>
                    {event.arrive?.city ?? `${dict.errors.events.NA}`}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div className="d-flex align-items-center gap-1">
                    <LuGamepad2 /><strong>{dict.events.card.game}: </strong>
                    {event.game ?? `${dict.errors.events.NA}`}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <BsHddStack /><strong>{dict.events.card.server}: </strong>
                    {event.server?.name ?? `${dict.errors.events.NO_SERVER}`}
                  </div>
                  <div className="d-flex align-items-center column-gap-1">
                    {dlcs(event.dlcs).length > 2 ? (
                      <>
                        <BsDownload /><strong>{dict.events.card.dlc}: </strong>
                        <a href={`https://store.steampowered.com/app/${dlcKeys(event.dlcs)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-light d-flex align-items-center column-gap-1">
                          <span className="text-primary fw-bold">{dlcs(event.dlcs)[0]}</span>
                        </a>
                        {dlcDiv(event.dlcs)}
                      </>
                    ) : dlcs(event.dlcs).length > 0 ? (
                      <a href={`https://store.steampowered.com/app/${dlcKeys(event.dlcs)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-light d-flex align-items-center column-gap-1">
                        <BsDownload /><strong>{dict.events.card.dlc}: </strong>
                        <span className="text-primary fw-bold">{dlcs(event.dlcs)}</span>
                      </a>
                    ) : (
                      <>
                        <BsDownload /><strong>{dict.events.card.dlc}: </strong>
                        {dict.errors.events.NO_DLC}
                      </>
                    )}
                  </div>
                </DivEvents>
                <BSButton variant="outline" size="lg" href={`/events/${event.id}`}>
                  {dict.events.card.event}
                </BSButton>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </>
  );
}

