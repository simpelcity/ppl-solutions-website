'use client'

import { Container, Card, Form } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"
import useDashboard from "@/hooks/useDashboard";
import { useState } from "react";

type Props = {
  dict: Dictionary;
}

export default function DashboardCard({ dict }: Props) {
  const { data, loading, error, sendData } = useDashboard();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      await sendData(title, url, message);

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

  return (
    <Container className="p-3 p-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm-sm px-0 bg-surface">
        <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">Dashboard</Card.Title>
        <Card.Body className="p-3 p-md-4">
          {loading && <p>Loading...</p>}
          {data && <p className="text-success">Message sent successfully!</p>}
          {error && <p className="text-danger">Error: {error}</p>}
          <Form onSubmit={handleSubmit} method="post">
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              className="input rounded-1 border-0 shadow-sm mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Form.Control
              type="text"
              name="url"
              placeholder="URL (optional)"
              className="input rounded-1 border-0 shadow-sm mb-3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Form.Control
              as="textarea"
              name="message"
              placeholder="Enter your message here..."
              rows={5}
              className="input rounded-1 border-0 shadow-sm mb-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Send to Discord</button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
