'use client'

import { Container, Card, Form, Row, Col, Dropdown, ButtonGroup } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"
import useDashboard from "@/hooks/useDashboard";
import { useState } from "react";
import { BSButton, ComingSoon } from "@/components";
import { FaAngleDown } from "react-icons/fa6";
import { useTheme } from 'next-themes'
import { type Locale } from '@/i18n'

type Props = {
  dict: Dictionary;
  lang: Locale;
}

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function CardDashboard({ dict, lang }: Props) {
  const { data, loading, error, status, sendData } = useDashboard();
  const { resolvedTheme } = useTheme();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [requestUrl, setRequestUrl] = useState('');
  const [method, setMethod] = useState('');
  const [HTTPStatus, setHTTPStatus] = useState('');

  const [messageType, setMessageType] = useState<"embed" | "error" | null>(null);

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const methods = [
    { method: "GET" },
    { method: "POST" },
    { method: "PUT" },
    { method: "PATCH" },
    { method: "DELETE" }
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      await sendData(title, url, message, requestUrl, method, HTTPStatus);

      resetForm();
    } catch (err: any) {
      const message = err?.message;
      console.error('Error sending message to Discord:', message);
    }
  }

  function resetForm() {
    setTitle('');
    setUrl('');
    setMessage('');
  }

  if (error && status === 403) {
    return (
      <div className="text-danger text-center d-flex align-items-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error}</div>
    )
  }

  return (
    <Container className="p-3 p-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm-sm px-0 bg-surface text-theme">
        <Card.Header className="bg-surface d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom">
          <Card.Title className="fs-3 m-0">Dashboard</Card.Title>

          <Dropdown as={ButtonGroup} className="message-type-dropdown" onToggle={(nextShow) => setIsTypeDropdownOpen(Boolean(nextShow))}>
            <BSButton variant="primary" className="text-light rounded-start-1 fw-semibold">{messageType ? messageType.charAt(0).toUpperCase() + messageType.slice(1) : 'Select Message Type'}</BSButton>
            <Dropdown.Toggle split variant="primary" className="px-2 d-flex align-items-center text-light">
              <span className={`ms-1 chevron-rotate-180 ${isTypeDropdownOpen ? 'is-open' : ''}`}>
                <FaAngleDown />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
              <Dropdown.Item onClick={() => setMessageType("embed")} className="py-1 px-3">Embed</Dropdown.Item>
              <Dropdown.Item onClick={() => setMessageType("error")} className="py-1 px-3">Error</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {loading && <p>Loading...</p>}
          {data && <p className="text-success">Message sent successfully!</p>}
          {error && <p className="text-danger">Error: {error}</p>}
          {messageType === "error" ? (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formTitle">
                    <Form.Label className="fw-bold">Title (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Your message title"
                      className="rounded-1 border-0 shadow-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">URL (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/dashboard"
                      className="rounded-1 border-0 shadow-sm"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">Request URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/api/endpoint"
                      className="rounded-1 border-0 shadow-sm"
                      value={requestUrl}
                      onChange={(e) => setRequestUrl(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formMethod">
                    <Form.Label className="fw-bold">HTTP Method</Form.Label>
                    <Form.Select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className={`rounded-1 border-0 shadow-sm d-flex ${method ? 'text-theme' : 'text-placeholder'}`}
                      required
                    >
                      <option value="" className="py-1 px-3 text-placeholder" disabled>Select method</option>
                      {methods.map((m) => (
                        <option key={m.method} value={m.method} className="py-1 px-3">{m.method}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formStatus">
                    <Form.Label className="fw-bold">HTTP Status</Form.Label>
                    <Form.Control
                      type="text"
                      className="rounded-1 border-0 shadow-sm"
                      placeholder="e.g. 200, 404, 500"
                      value={HTTPStatus}
                      onChange={(e) => setHTTPStatus(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}></Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label className="fw-bold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Enter your message here..."
                  rows={5}
                  className="rounded-1 border-0 shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <BSButton variant="primary" type="submit">Send to Discord</BSButton>
            </Form>
          ) : (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formTitle">
                    <Form.Label className="fw-bold">Title (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Your message title"
                      className="rounded-1 border-0 shadow-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">URL (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/dashboard"
                      className="rounded-1 border-0 shadow-sm"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label className="fw-bold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Enter your message here..."
                  rows={5}
                  className="rounded-1 border-0 shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <BSButton variant="primary" type="submit">Send to Discord</BSButton>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
