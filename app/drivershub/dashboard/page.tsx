"use client"

import { CardTeamForm, Dashboard } from "@/components"
import TeamGrid from "@/components/TeamGrid"
import { Row, Col } from "react-bootstrap"
import "@/styles/Drivershub.scss"
import "@/styles/roles.scss"

export default function DashboardPage() {
  return (
    <>
      <title>Dashboard | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Dashboard | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/drivershub/dashboard" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/drivershub/dashboard" />

      <main className="fs-5">
        <section className="drivershub w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
          <Dashboard title="Dashboard">
            <Row className="w-100">
              <CardTeamForm />
              <Col xs={12} md={6} xl={6} className="d-flex justify-content-center">
                {/* <TeamGrid /> */}
              </Col>
            </Row>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

