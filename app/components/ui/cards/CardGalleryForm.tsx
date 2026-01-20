"use client";

import { useState } from "react";
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BSButton } from "@/components/";
import { useGallery, GalleryItem } from "@/hooks/useGallery";

type ConfirmAction = "delete-item" | null;

type GalleryDict = {
  form: {
    titleNewItem: string;
    titleEditItem: string;
    title: string;
    titlePlaceholder: string;
    image: string;
    imageEdit: string;
    submit: string;
    submitEdit: string;
    cancel: string;
  };
  card: {
    title: string;
  };
  modal: {
    title: string;
    description: string;
    cancel: string;
    confirm: string;
  };
};

type CardGalleryFormProps = {
  dict?: GalleryDict;
};

export default function CardGalleryForm({ dict }: CardGalleryFormProps) {
  const {
    items,
    loading,
    submitting,
    editingId,
    error,
    success,
    setEditingId,
    createItem,
    updateItem,
    deleteItem,
  } = useGallery();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [targetId, setTargetId] = useState<number | null>(null);

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setEditingId(null);
    const input = document.getElementById("gallery-file-input") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;
    await createItem(title.trim(), file);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !title.trim()) return;
    await updateItem(editingId, title.trim(), file);
    resetForm();
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setFile(null);
  };

  const openConfirmModal = (id: number) => {
    setTargetId(id);
    setConfirmAction("delete-item");
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (targetId) await deleteItem(targetId);
    setShowModal(false);
    setTargetId(null);
    setConfirmAction(null);
  };

  return (
    <>
      <Col xs={12} md={10} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">{editingId ? (dict?.form?.titleEditItem || "Edit Gallery Item") : (dict?.form?.titleNewItem || "Add Gallery Item")}</Card.Title>
          <Card.Body>
            <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{dict?.form?.title || "Title"}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={dict?.form?.titlePlaceholder || "Image title"}
                  className="rounded-0 border-0 shadow bg-dark-subtle"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{dict?.form?.image || "Image"} {editingId ? (dict?.form?.imageEdit || "(leave empty to keep current)") : ""}</Form.Label>
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
                <Alert variant="danger" className="py-2" dismissible>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="py-2" dismissible>
                  {success}
                </Alert>
              )}

              <BSButton variant="primary" size="lg" type="submit" disabled={submitting} classes="mt-2">
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : editingId ? (
                  dict?.form?.submitEdit || "Update Item"
                ) : (
                  dict?.form?.submit || "Add Item"
                )}
              </BSButton>

              {editingId && (
                <BSButton
                  variant="secondary"
                  classes="mt-2 ms-2 border-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setFile(null);
                    const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement | null;
                    if (fileInput) fileInput.value = "";
                  }}
                  disabled={submitting}>
                  {dict?.form?.cancel || "Cancel"}
                </BSButton>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* Gallery Items List */}
      <Col xs={12} md={10} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">{dict?.card?.title || "Gallery Items"}</Card.Title>
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
                    className="d-flex align-items-center justify-content-between bg-dark text-light border-dark-subtle flex-wrap row-gap-2">
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
                        onClick={() => openConfirmModal(item.id)}
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
          <Modal.Title>{dict?.modal?.title || "Confirm Action"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-item" && (dict?.modal?.description || "Are you sure you want to delete this gallery item?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {dict?.modal?.cancel || "Cancel"}
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {dict?.modal?.confirm || "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

