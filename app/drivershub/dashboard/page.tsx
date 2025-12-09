import { CardTeamForm, Dashboard } from "@/components"
import { Container, ListGroup, Row, Col } from "react-bootstrap"
import "@/styles/Drivershub.scss"

export const metadata = {
  title: "Dashboard | PPL Solutions",
  description: "Welcome to PPL Solutions VTC's admin dashboard page",
}

export default function DashboardPage() {
  return (
    <main className="fs-5">
      <section className="drivershub w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
        <Dashboard title="Dashboard">
          <Row className="w-100">
            <CardTeamForm />
            <Col xs={12} md={6} xl={6}></Col>
          </Row>
        </Dashboard>
      </section>
    </main>
  )
}

