"use client"

import { CardTeamForm, Dashboard } from "@/components"
import TeamGrid from "@/components/TeamGrid"
import { Container, ListGroup, Row, Col } from "react-bootstrap"
import { useEffect } from "react"
import "@/styles/Drivershub.scss"
import "@/styles/roles.scss"

export default function DashboardPage() {
  useEffect(() => {
    document.title = "Dashboard | PPL Solutions"

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement("meta")
      metaDesc.setAttribute("name", "description")
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute("content", "Welcome to PPL Solutions VTC's admin dashboard page")

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement("meta")
      ogTitle.setAttribute("property", "og:title")
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute("content", "Dashboard | PPL Solutions")
  }, [])
  return (
    <main className="fs-5">
      <section className="drivershub w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
        <Dashboard title="Dashboard">
          <Row className="w-100">
            <CardTeamForm />
            <Col xs={12} md={6} xl={6} className="d-flex justify-content-center">
              <TeamGrid />
            </Col>
          </Row>
        </Dashboard>
      </section>
    </main>
  )
}

