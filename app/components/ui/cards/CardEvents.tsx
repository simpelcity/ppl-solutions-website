import { Col, Card, CardImg, CardBody, CardTitle } from "react-bootstrap";
import { BsCalendar3 } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa6";
import { LuTruck } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import { LuGamepad2 } from "react-icons/lu";
import { BsHddStack } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { DivEvents } from "@/components";
import BSButton from "@/components/ui/Button";

export default async function CardEvents() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/events`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
  const data = await response.json();
  const events = data.response;
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
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatTime = (dateString: Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      {events.map((event: any) => {
        return (
          <Col xs={12} md={6} xl={4} key={event.id}>
            <Card className="bg-dark text-light rounded-0 border-0 shadow">
              <CardImg
                variant="top"
                className="rounded-0"
                src={event.banner || "/default-event-image.jpg"}
                alt={event.name}
                loading="lazy"
              />
              <CardBody className="d-flex flex-column align-items-stretch align-items-md-start">
                <CardTitle className="fs-4 mb-3 text-start">{event.name}</CardTitle>
                <DivEvents>
                  <div>
                    <BsCalendar3 /> <strong>Date: </strong>
                    {formatDate(event.meetup_at)}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div>
                    <FaRegClock /> <strong>Meetup Time: </strong>
                    {formatTime(event.meetup_at)}
                  </div>
                  <div>
                    <FaRegClock /> <strong>Departure Time: </strong>
                    {formatTime(event.start_at)}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div>
                    <LuTruck /> <strong>Departure: </strong>
                    {event.departure?.city ?? "N/A"}
                  </div>
                  <div>
                    <FiMapPin /> <strong>Destination: </strong>
                    {event.arrive?.city ?? "N/A"}
                  </div>
                </DivEvents>
                <DivEvents>
                  <div>
                    <LuGamepad2 /> <strong>Game: </strong>
                    {event.game ?? "N/A"}
                  </div>
                  <div>
                    <BsHddStack /> <strong>Server: </strong>
                    {event.server?.name ?? "Event Server"}
                  </div>
                  <div>
                    <BsDownload /> <strong>DLC: </strong>
                    {event.dlc ?? "None"}
                  </div>
                </DivEvents>
                <BSButton variant="outline" size="lg" href={`https://truckersmp.com${event.url}`} target="_blank">
                  Event
                </BSButton>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </>
  );
}

