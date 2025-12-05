import { CardTeamForm } from "@/components"
import { Container, ListGroup } from "react-bootstrap"

export default function DashboardPage() {
  return (
    <main className="fs-5">
      <section className="w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
        <Container className="d-flex justify-content-center">
          <h1 className="mb-3">Dashboard</h1>
          <CardTeamForm />
        </Container>
      </section>
    </main>
  )
}

