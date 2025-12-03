"use client"

import { Container, Card } from "react-bootstrap"
import { StartBanner } from "@/components"

export default function ApplyPage() {
  return (
    <>
      <main className="fs-5">
        <StartBanner>apply</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Card>
              <Card.Body>
                <Card.Title>
                  So you want to apply to become a driver for PPL Solutions? Please make a ticket in our{" "}
                  <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="text-decoration-none fw-bold">
                    Discord
                  </a>{" "}
                  server, see you there!
                </Card.Title>
              </Card.Body>
            </Card>
          </Container>
        </section>
      </main>
    </>
  )
}
