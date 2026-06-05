"use client"

import { useEffect, useState } from "react"
import { Row, Col, Card, Spinner } from "react-bootstrap"
import { Loader, RateLimitError } from '@/components'
import type { Dictionary } from "@/app/i18n"
import axios from "axios";
import { parseApiError, useRateLimitState } from "@/hooks/useRateLimitState";

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
  const { isRateLimited, rateLimitSecondsRemaining, clearRateLimitCountdown, applyRateLimit } = useRateLimitState()

  const fetchGallery = async (mounted: boolean) => {
    try {
      setLoading(true)
      setError(null)
      clearRateLimitCountdown()
      const res = await axios.get("/api/gallery")
      if (res.status !== 200) throw new Error(dict.errors.gallery.ERROR_LOADING_GALLERY, { cause: res.status })
      const data = res.data
      if (!mounted) return
      setItems(data.gallery ?? [])
    } catch (err: any) {
      console.error("Failed to fetch gallery:", err)
      const parsed = parseApiError(err, dict.errors.gallery.ERROR_LOADING_GALLERY)
      if (mounted) {
        setError(parsed.message)
        applyRateLimit(parsed.rateLimit)
      }
    } finally {
      if (mounted) setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    fetchGallery(mounted)
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <Loader dict={dict} />

  if (error) {
    if (isRateLimited) {
      return <RateLimitError dict={dict} secondsRemaining={rateLimitSecondsRemaining ?? 0} onRetry={() => fetchGallery(true)} retryLoading={loading} />
    }

    return <div className="text-danger fw-bold fs-4">{dict.errors.gallery.ERROR_LOADING_GALLERY} {error}</div>
  }

  if (items.length === 0) {
    return <div>{dict.errors.gallery.NO_IMAGES_FOUND}</div>
  }

  return (
    <>
      <Row className="w-100 row-gap-3 row-gap-md-4 d-flex justify-content-center">
        {items.map((it) => (
          <Col key={it.id} xs={12} md={6} xl={3}>
            <Card className="h-100 rounded-1 border-0 shadow-sm bg-surface">
              <Card.Img
                variant="top"
                src={it.image_url ?? `/assets/icons/image-missing.png`}
                alt={it.title ?? `Image ${it.id}`}
                loading="lazy"
                className="rounded-top-1"
              />
              <Card.Body className="p-0">
                <Card.Title className="p-2 m-0">{it.title ?? "Untitled"}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

