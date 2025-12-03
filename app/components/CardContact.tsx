"use client"

import { Card, Form, Col } from "react-bootstrap"
import { ButtonOutline } from "@/components"
import { FaDiscord, FaTiktok, FaTruck } from "react-icons/fa"
import { IconContext } from "react-icons"

export default function CardContact() {
  return (
    <>
      <Card className="rounded-0 border-0 shadow bg-dark h-100">
        <Card.Body className="p-4">
          <Form
            method="post"
            action="https://formspree.io/f/mqapoajo"
            className="text-light text-start d-flex column-gap-2"
            data-bs-theme="dark">
            <Col xs={8} xl={10}>
              <Form.Group className="mb-2">
                <Form.Label>Name / Discord username *</Form.Label>
                <Form.Control type="text" name="name" className="input rounded-0 border border-2" required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  className="input rounded-0 border border-2"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={5}
                  className="input rounded-0 border border-2"
                  required
                />
              </Form.Group>
              <ButtonOutline type="submit" border="primary" text="primary" paddingy="10" paddingx="20" width="2">
                Send
              </ButtonOutline>
            </Col>
            <Col xs={4} xl={2} className="d-flex flex-column align-items-center justify-content-center">
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
            </Col>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
