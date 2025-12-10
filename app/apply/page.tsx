"use client"

import { Container, Card, Row, Col } from "react-bootstrap"
import { StartBanner } from "@/components"
import { FaDiscord, FaTiktok, FaTruck } from "react-icons/fa"
import { IconContext } from "react-icons"

export default function ApplyPage() {
  return (
    <>
      <title>Apply | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Apply | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/apply" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/apply" />

      <main className="fs-5">
        <StartBanner>apply</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center">
              <Col xs={12} md={10} xl={7}>
                <Card className="bg-dark text-light">
                  <Card.Body>
                    <Card.Title>
                      So you want to apply to become a driver for PPL Solutions? Please make a ticket in our{" "}
                      <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="text-decoration-none fw-bold">
                        Discord
                      </a>{" "}
                      server, see you there!
                    </Card.Title>
                    <div className="d-flex justify-content-center mt-4">
                      <div className="m-3 mt-0 d-flex flex-column align-items-center">
                        <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="me-1">
                          <IconContext.Provider value={{ className: "react-icons" }}>
                            <FaDiscord className="discord-icon p-1" />
                          </IconContext.Provider>
                        </a>
                        <p className="m-0">Discord</p>
                      </div>
                      <div className="m-3 mt-0 d-flex flex-column align-items-center">
                        <a href="" target="_blank" className="me-1">
                          <IconContext.Provider value={{ className: "react-icons" }}>
                            <FaTiktok className="tiktok-icon p-1" />
                          </IconContext.Provider>
                        </a>
                        <p className="m-0">TikTok</p>
                      </div>
                      <div className="m-3 mt-0 d-flex flex-column align-items-center">
                        <a href="" target="_blank" className="me-1">
                          <IconContext.Provider value={{ className: "react-icons" }}>
                            <FaTruck className="tmp-icon p-1" />
                          </IconContext.Provider>
                        </a>
                        <p className="m-0">TruckersMP</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

