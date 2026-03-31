'use client'

import { Col, Card, CardImg, CardBody, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "react-bootstrap";
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
  console.log(events, loading, error)

  if (loading) {
    return (
      <LoaderSpinner dict={dict}>{dict.events.loading}</LoaderSpinner>
    );
  }

  if (error) {
    return (
      <div className="text-center text-light">
        <div className="text-danger fw-bold fs-4">{error}</div>
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div className="text-center text-light">
        <div className="fw-bold fs-4 d-flex justify-content-center align-items-center column-gap-2">{dict.events.errors.NO_EVENTS} <BsCalendar3 /></div>
      </div>
    );
  }

  if (!events) return null;

  const formatDate = (dateString: Date) => {
    if (!dateString) return `${dict.events.errors.NA}`;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatTime = (dateString: Date) => {
    if (!dateString) return `${dict.events.errors.NA}`;
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const dlcs = (dlcObject: object) => {
    if (!dlcObject) return `${dict.events.errors.NO_DLC}`;
    const arr = Object.values(dlcObject);
    return arr;
  }

  const dlcDiv = (dlcObject: object) => {
    const dlcArray = Object.values(dlcObject);
    return (
      <Dropdown>
        <DropdownToggle className="p-0 text-decoration-none ms-1 bg-transparent border-0 text-light">
          +{dlcArray.length - 1} {dict.events.card.more}
        </DropdownToggle>
        <DropdownMenu variant="dark">
          {dlcArray.map((dlc: any, index: number) => (
            <DropdownItem key={index}>{dlc}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <>
      {events.map((event: any) => {
        return (
          <Col xs={12} md={6} xl={4} key={event.id}>
            <Card className="bg-dark text-light rounded-0 border-0 shadow-sm">
              <CardImg
                variant="top"
                className="rounded-0"
                src={event.banner || "https://placehold.co/1920x500?text=No+Banner"}
                alt={event.name}
                loading="lazy"
              />
              <CardBody className="d-flex flex-column align-items-stretch align-items-md-start">
                <CardTitle className="fs-4 mb-3 text-start">{event.name}</CardTitle>
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
                    {event.departure?.city ?? `${dict.events.errors.NA}`}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FiMapPin /><strong>{dict.events.card.destinationLocation}: </strong>
                    {event.arrive?.city ?? `${dict.events.errors.NA}`}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div className="d-flex align-items-center gap-1">
                    <LuGamepad2 /><strong>{dict.events.card.game}: </strong>
                    {event.game ?? `${dict.events.errors.NA}`}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <BsHddStack /><strong>{dict.events.card.server}: </strong>
                    {event.server?.name ?? `${dict.events.errors.NO_SERVER}`}
                  </div>
                  <div className="d-flex align-items-center column-gap-1">
                    <BsDownload /><strong>{dict.events.card.dlc}: </strong>
                    {dlcs(event.dlcs).length > 0 ? dlcs(event.dlcs)[0] : `${dict.events.errors.NO_DLC}`}
                    {dlcs(event.dlcs).length > 2 ? dlcDiv(event.dlcs) : null}
                  </div>
                </DivEvents>
                <BSButton variant="outline" size="lg" href={`https://truckersmp.com${event.url}`} target="_blank">
                  {dict.events.card.event}
                </BSButton>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </>
  );
}

