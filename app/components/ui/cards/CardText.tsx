'use client';

import { Card } from 'react-bootstrap';
import { FaUsers, FaEdit } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";

const ICONS = {
  FaUsers,
  FaEdit,
  FaGears,
};

interface CardTextProps {
  icon?: keyof typeof ICONS;
  title: string;
  children: React.ReactNode;
}

export default function CardText({ icon, title, children }: CardTextProps) {
  const Icon = typeof icon === 'string' ? ICONS[icon] : null;

  return (
    <Card className="h-100 rounded-0 border-0 shadow bg-dark-subtle text-light">
      <Card.Body>
        {Icon ? <Icon className="fs-1" /> : null}

        <Card.Title className="fs-2 text-primary my-2 text-uppercase">{title}</Card.Title>
        <Card.Text>{children}</Card.Text>
      </Card.Body>
    </Card>
  );
}
