"use client"

import { Container, Card, Row, Col } from "react-bootstrap"
import { StartBanner } from "@/components"
import { FaDiscord, FaTiktok, FaTruck } from "react-icons/fa"
import { IconContext } from "react-icons"
import { useEffect } from "react"

export default function ApplyPage() {
  useEffect(() => {
    document.title = "Apply | PPL Solutions"

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement("meta")
      metaDesc.setAttribute("name", "description")
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute("content", "Welcome to PPL Solutions VTC's apply page")

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement("meta")
      ogTitle.setAttribute("property", "og:title")
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute("content", "Forgot your password? | PPL Solutions")
  }, [])

  return (
    <>
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

