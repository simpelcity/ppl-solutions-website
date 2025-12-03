"use client";

import { Card } from "react-bootstrap";

interface CardGalleryProps {
  img: string;
  title: string;
}

export default function CardGallery({ img, title }: CardGalleryProps) {
  return (
    <>
      <Card className="h-100 rounded-0 border-0 shadow bg-dark text-light">
        <Card.Img variant="top" src={`/assets/images/gallery/${img}`} alt={`${title}`} className="rounded-0" />
        <Card.Body className="p-0">
          <Card.Title className="my-2">{title}</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
}
