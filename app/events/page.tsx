import { StartBanner } from "@/components"
import { Container, Row } from "react-bootstrap"
import CardEvents from "@/components/CardEvents"

export default async function EventsPage() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000" // add BASE_URL to .env.local in prod
  const eventsUrl = `${baseUrl}/api/events`
  return (
    <>
      <main className="fs-5">
        <StartBanner>events</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <CardEvents url={eventsUrl} />
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

