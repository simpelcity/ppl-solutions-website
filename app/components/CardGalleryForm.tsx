"use client"

import { useState, useEffect } from "react"
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Modal } from "react-bootstrap"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { ButtonPrimary, ButtonSecondary } from "@/components"

interface GalleryItem {
  id: number
  title: string | null
  image_url: string | null
  image_path: string | null
}

type ConfirmAction = "delete-item" | null

export default function CardGalleryForm() {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [targetId, setTargetId] = useState<number | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gallery")
      const json = await res.json()
      if (res.ok) {
        setItems(json.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!file) {
      setError("Image is required")
      return
    }

    const fd = new FormData()
    fd.append("title", title.trim())
    fd.append("file", file)

    setSubmitting(true)
    try {
      const res = await fetch("/api/gallery", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to add item")
      }
      setSuccess("Gallery item added")
      setTitle("")
      setFile(null)
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement | null
      if (fileInput) fileInput.value = ""
      fetchItems()
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    const fd = new FormData()
    fd.append("id", editingId.toString())
    fd.append("title", title.trim())
    if (file) fd.append("file", file)

    setSubmitting(true)
    try {
      const res = await fetch("/api/gallery", { method: "PUT", body: fd })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to update")
      }
      setSuccess("Gallery item updated")
      setTitle("")
      setFile(null)
      setEditingId(null)
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement | null
      if (fileInput) fileInput.value = ""
      fetchItems()
    } catch (err: any) {
      setError(err?.message ?? "Update failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setTitle(item.title || "")
    setFile(null)
  }

  const openConfirmModal = (action: ConfirmAction, id: number) => {
    setConfirmAction(action)
    setTargetId(id)
    setShowModal(true)
  }

  const handleConfirm = async () => {
    setShowModal(false)
    if (!targetId || !confirmAction) return

    if (confirmAction === "delete-item") {
      await executeDelete(targetId)
    }

    setTargetId(null)
    setConfirmAction(null)
  }

  const executeDelete = async (id: number) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || "Failed to delete")
      }
      setSuccess("Gallery item deleted")
      fetchItems()
    } catch (err: any) {
      setError(err?.message ?? "Delete failed")
    }
  }

  return (
    <>
      <Col xs={12} md={6} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">{editingId ? "Edit Gallery Item" : "Add Gallery Item"}</Card.Title>
          <Card.Body>
            <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Image title"
                  className="rounded-0 border-0 shadow bg-dark-subtle"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image {editingId ? "(leave empty to keep current)" : ""}</Form.Label>
                <Form.Control
                  id="gallery-file-input"
                  type="file"
                  accept="image/*"
                  className="rounded-0 border-0 shadow bg-dark-subtle"
                  onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)}
                  disabled={submitting}
                />
              </Form.Group>

              {error && (
                <Alert variant="danger" className="py-2" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="py-2" dismissible onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              <ButtonPrimary type="submit" disabled={submitting} classes="mt-2">
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : editingId ? (
                  "Update Item"
                ) : (
                  "Add Item"
                )}
              </ButtonPrimary>

              {editingId && (
                <ButtonSecondary
                  classes="mt-2 ms-2 border-secondary"
                  onClick={() => {
                    setEditingId(null)
                    setTitle("")
                    setFile(null)
                    const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement | null
                    if (fileInput) fileInput.value = ""
                  }}
                  disabled={submitting}>
                  Cancel
                </ButtonSecondary>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* Gallery Items List */}
      <Col xs={12} md={6} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">Gallery Items</Card.Title>
          <Card.Body className="p-1">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center column-gap-2">
                <Spinner animation="border" />
                <span className="fs-4">Loading gallery items</span>
              </div>
            ) : items.length === 0 ? (
              <p className="text-muted">No items yet</p>
            ) : (
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    className="d-flex align-items-center justify-content-between bg-dark text-light border-dark-subtle">
                    <div className="d-flex align-items-center">
                      <Image
                        src={item.image_url || "/assets/icons/image-placeholder.png"}
                        alt={item.title || "Gallery image"}
                        width={60}
                        height={60}
                        className="me-3"
                        style={{ objectFit: "cover" }}
                      />
                      <span>{item.title}</span>
                    </div>
                    <div className="d-flex column-gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center justify-content-center p-2"
                        onClick={() => handleEdit(item)}
                        title="Edit item">
                        <FaEdit className="fs-6" />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center justify-content-center p-2"
                        onClick={() => openConfirmModal("delete-item", item.id)}
                        title="Delete item">
                        <FaTrash className="fs-6" />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-item" && "Are you sure you want to delete this gallery item?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

