'use client'

import { Container, Card } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function DashboardCard({ dict }: Props) {
  return (
    <Container className="p-3 p-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm-sm px-0 bg-surface">
        <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">Dashboard</Card.Title>
        <Card.Body className="p-3 p-md-4">
          <p>Welcome</p>
        </Card.Body>
      </Card>
    </Container>
  )
}
