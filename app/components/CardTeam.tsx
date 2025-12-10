"use client"

import { Card, Image, Col } from "react-bootstrap"

interface CardTeamProps {
  img: string
  member: string
  role: string
  children: React.ReactNode
}

export default function CardTeam({ img, member, role, children }: CardTeamProps) {
  return (
    <Col xs={12} md={6} lg={4} xl={3}>
      <Card className="h-100 rounded-0 border-0 shadow bg-dark">
        <Card.Body className="p-4">
          <Image
            src={`/assets/images/team/${img}`}
            width={150}
            height={150}
            alt={`${member}`}
            loading="lazy"
            roundedCircle
          />
          <Card.Title className="fs-3 mt-2 text-light">{member}</Card.Title>
          <Card.Text className={`${role}`}>{children}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

