"use client"

import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spinner } from "react-bootstrap"

type GalleryItem = {
  id: number
  title?: string | null
  description?: string | null
  image_path?: string | null
  image_url?: string | null
  created_at?: string | null
}

export default function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchGallery = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/gallery")
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const json = await res.json()
        if (!mounted) return
        setItems(json.data ?? [])
      } catch (err: any) {
        console.error("Failed to fetch gallery:", err)
        if (mounted) setError(err.message ?? String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchGallery()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center text-light p-4">
        <Spinner animation="border" /> Loading gallery...
      </div>
    )
  }

  if (error) {
    return <div className="text-danger">Error loading gallery: {error}</div>
  }

  if (items.length === 0) {
    return <div>No images found.</div>
  }

  return (
    <>
      <Row className="w-100 row-gap-4 d-flex justify-content-center">
        {items.map((it) => (
          <Col key={it.id} xs={12} md={6} xl={3}>
            <Card className="h-100 rounded-0 border-0 shadow" data-bs-theme="dark">
              <Card.Img
                variant="top"
                src={it.image_url ?? "/assets/icons/image-missing.png"}
                alt={it.title ?? `Image ${it.id}`}
                loading="lazy"
                className="rounded-0"
              />
              <Card.Body className="p-0">
                <Card.Title className="my-2">{it.title ?? "Untitled"}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

