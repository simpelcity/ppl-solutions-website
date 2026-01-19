import { Col, Card, CardImg, CardBody, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "react-bootstrap";
import { BsCalendar3 } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa6";
import { LuTruck } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import { LuGamepad2 } from "react-icons/lu";
import { BsHddStack } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { DivEvents, BSButton } from "@/components/";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  events: {
    meta: {
      title: string,
      description: string
    }
    title: string,
    card: {
      date: string,
      meetupTime: string,
      departureTime: string,
      departureLocation: string,
      destinationLocation: string,
      game: string,
      server: string,
      dlc: string,
      event: string,
      more: string
    },
    error: {
      noEvents: string
      na: string,
      noServer: string,
      noDLC: string
    }
  }
}

export default async function CardEvents({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/events`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
  const data = await response.json();
  const events = Object.values(data.response);
  console.log("Fetched events:", events);

  if (!events || events.length === 0) {
    return (
      <div className="text-center text-light my-5">
        <h2>
          No upcoming events <BsCalendar3 />
        </h2>
      </div>
    );
  }

  const formatDate = (dateString: Date) => {
    if (!dateString) return `${dict.events.error.na}`;
    const date = new Date(dateString);
    console.log("Formatting date:", date);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatTime = (dateString: Date) => {
    if (!dateString) return `${dict.events.error.na}`;
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const dlcs = (dlcObject: object) => {
    if (!dlcObject) return `${dict.events.error.noDLC}`;
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
            <Card className="bg-dark text-light rounded-0 border-0 shadow">
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
                    {event.departure?.city ?? `${dict.events.error.na}`}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FiMapPin /><strong>{dict.events.card.destinationLocation}: </strong>
                    {event.arrive?.city ?? `${dict.events.error.na}`}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div className="d-flex align-items-center gap-1">
                    <LuGamepad2 /><strong>{dict.events.card.game}: </strong>
                    {event.game ?? `${dict.events.error.na}`}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <BsHddStack /><strong>{dict.events.card.server}: </strong>
                    {event.server?.name ?? `${dict.events.error.noServer}`}
                  </div>
                  <div className="d-flex align-items-center column-gap-1">
                    <BsDownload /><strong>{dict.events.card.dlc}: </strong>
                    {dlcs(event.dlcs).length > 0 ? dlcs(event.dlcs)[0] : `${dict.events.error.noDLC}`}
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

