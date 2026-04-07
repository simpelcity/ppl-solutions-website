"use client"

import { useEffect, useState } from "react"
import { Row, Col, Card, Spinner } from "react-bootstrap"
import { LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"
import axios from "axios";

type GalleryItem = {
  id: number
  title?: string | null
  description?: string | null
  image_path?: string | null
  image_url?: string | null
  created_at?: string | null
}

type Props = {
  dict: Dictionary;
}

export default function GalleryGrid({ dict }: Props) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchGallery = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/gallery")
        if (res.status !== 200) throw new Error(dict.errors.gallery.ERROR_LOADING_GALLERY, { cause: res.status })
        const data = res.data
        if (!mounted) return
        setItems(data.gallery ?? [])
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

  if (loading) return <LoaderSpinner dict={dict} />

  if (error) {
    return <div className="text-danger">{dict.errors.gallery.ERROR_LOADING_GALLERY} {error}</div>
  }

  if (items.length === 0) {
    return <div>{dict.errors.gallery.NO_IMAGES_FOUND}</div>
  }

  return (
    <>
      <Row className="w-100 row-gap-4 d-flex justify-content-center">
        {items.map((it) => (
          <Col key={it.id} xs={12} md={6} xl={3}>
            <Card className="h-100 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
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

