"use client";

import { Card, Form, Col, Row } from "react-bootstrap";
import { BSButton } from "@/components";
import { FaDiscord, FaTiktok, FaInstagram, FaTruck } from "react-icons/fa";
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary
}

export default function CardContact({ dict }: Props) {
  return (
    <>
      <Card className="rounded-1 border-0 shadow-sm bg-surface h-100 text-theme">
        <Card.Body className="p-4">
          <Row className="d-flex justify-content-center row-gap-3 row-gap-md-4">
            <Col xs={12} md={10} xl={10} className="">
              <Form
                method="post"
                action="https://formspree.io/f/mqapoajo"
                className="text-start"
              >
                <Form.Group className="mb-3">
                  <Form.Label>{`${dict.contact.form.name} *`}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder={dict.contact.form.namePlaceholder}
                    className="input rounded-1 border-0 shadow-sm"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{`${dict.contact.form.email} *`}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder={dict.contact.form.emailPlaceholder}
                    className="input rounded-1 border-0 shadow-sm"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{`${dict.contact.form.message} *`}</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    placeholder={dict.contact.form.messagePlaceholder}
                    rows={5}
                    className="input rounded-1 border-0 shadow-sm"
                    required
                  />
                </Form.Group>
                <div className="d-grid d-md-inline-block">
                  <BSButton variant="outline" size="lg" type="submit" border="primary" text="primary" width="2">
                    {dict.contact.form.submit}
                  </BSButton>
                </div>
              </Form>
            </Col>
            <Col xs={12} md={2} xl={2} className="">
              <Row className="d-flex row-gap-3 row-gap-md-4">
                <Col xs={6} md={12} xl={12}>
                  <div className="d-flex flex-column align-items-center">
                    <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="me-1">
                      <FaDiscord className="react-icons discord-icon p-1" />
                    </a>
                    <p className="m-0">Discord</p>
                  </div>
                </Col>
                <Col xs={6} md={12} xl={12}>
                  <div className="d-flex flex-column align-items-center">
                    <a href="https://www.tiktok.com/@pplsolutionsvtc" target="_blank" className="me-1">
                      <FaTiktok className="react-icons tiktok-icon p-1" />
                    </a>
                    <p className="m-0">TikTok</p>
                  </div>
                </Col>
                <Col xs={6} md={12} xl={12}>
                  <div className="d-flex flex-column align-items-center">
                    <a href="https://instagram.com/ppl.solutions" target="_blank" className="me-1">
                      <FaInstagram className="react-icons instagram-icon p-1" />
                    </a>
                    <p className="m-0">Instagram</p>
                  </div>
                </Col>
                <Col xs={6} md={12} xl={12}>
                  <div className="d-flex flex-column align-items-center">
                    <a href="https://truckersmp.com/vtc/74455" target="_blank" className="me-1">
                      <FaTruck className="react-icons truckersmp-icon p-1" />
                    </a>
                    <p className="m-0">TruckersMP</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

