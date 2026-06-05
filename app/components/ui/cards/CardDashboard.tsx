'use client'

import { Container, Card, Form, Row, Col, Dropdown } from 'react-bootstrap'
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
  const { data, loading, error, sendData } = useDashboard();
  const { resolvedTheme } = useTheme();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [requestUrl, setRequestUrl] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');

  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  
  const isComingSoon = true;

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
      await sendData(title, url, message, requestUrl, method, status);

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

  if (isComingSoon) {
    return (
      <Container className="p-3 p-md-4 d-flex justify-content-center" fluid>
        <Col xs={12} md={10} lg={6}>
          <ComingSoon dict={dict} lang={lang} />
        </Col>
      </Container>
    )
  }

  return (
    <Container className="p-3 p-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm-sm px-0 bg-surface text-theme">
        <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker text-center">Dashboard</Card.Title>
        <Card.Body className="p-3 p-md-4">
          {loading && <p>Loading...</p>}
          {data && <p className="text-success">Message sent successfully!</p>}
          {error && <p className="text-danger">Error: {error}</p>}
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
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
        </Card.Body>
      </Card>
    </Container>
  )
}
