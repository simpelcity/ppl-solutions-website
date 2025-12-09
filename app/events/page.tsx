import { StartBanner } from "@/components"
import { Container, Row } from "react-bootstrap"
import CardEvents from "@/components/CardEvents"

export default async function EventsPage() {
  return (
    <>
      <main className="fs-5">
        <StartBanner>events</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <CardEvents />
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

