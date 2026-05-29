"use client";

import { useState, type ChangeEvent } from "react";
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Modal, Row, Container } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { BSButton, LoaderSpinner, RateLimitError } from "@/components";
import { useGallery, GalleryItem } from "@/hooks/useGallery";
import type { Dictionary } from "@/app/i18n"

type ConfirmAction = "delete-item" | null;

type CardGalleryFormProps = {
  dict: Dictionary;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export default function CardGalleryForm({ dict }: CardGalleryFormProps) {
  const galleryDict = dict.drivershub.gallery;
  const settingsDict = dict.drivershub.profile.settingsPage;

  const {
    items,
    loading,
    submitting,
    editingId,
    error,
    isRateLimited,
    rateLimitSecondsRemaining,
    success,
    setEditingId,
    createItem,
    updateItem,
    deleteItem,
    retryGallery,
  } = useGallery(dict);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [galleryPictureFileError, setGalleryPictureFileError] = useState<string | null>(null);
  const [galleryFileName, setGalleryFileName] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [targetId, setTargetId] = useState<number | null>(null);

  function validateImageFile(file: File) {
      if (file.size > MAX_FILE_SIZE) {
        return dict.errors.files.FILE_TOO_LARGE;
      }
  
      if (!ALLOWED_TYPES.includes(file.type)) {
        return dict.errors.files.INVALID_FILE_TYPE;
      }
  
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return dict.errors.files.INVALID_FILE_EXTENSION;
      }
  
      return null;
    }
  
    function handleGalleryPictureChange(e: ChangeEvent<HTMLInputElement>) {
      const selectedFile = e.target.files?.[0] ?? null;
  
      if (!selectedFile) {
        setFile(null);
        setGalleryPictureFileError(null);
        return;
      }
  
      const validationError = validateImageFile(selectedFile);
      if (validationError) {
        setFile(null);
        setGalleryPictureFileError(validationError);
        return;
      }
  
      setGalleryPictureFileError(null);
      setFile(selectedFile);
      setGalleryFileName(selectedFile.name);
    };

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setGalleryFileName("");
    setGalleryPictureFileError(null);
    setEditingId(null);

    const input = document.getElementById("gallery-file-input") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!title.trim() || !file) return;
      await createItem(title.trim(), file);

      resetForm();
    } catch (err: any) {
      const message = err?.message || dict.errors.UNEXPECTED;
      setGalleryPictureFileError(message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!editingId || !title.trim()) return;
      await updateItem(editingId, title.trim(), file);

      resetForm();
    } catch (err: any) {
      const message = err?.message || dict.errors.UNEXPECTED;
      setGalleryPictureFileError(message);
    }
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
      <Container className="p-3 p-md-4" fluid>
        <Row className="row-gap-3 row-gap-md-4 d-flex justify-content-center">
          <Col xs={12} md={10} lg={6}>
            <Card className="px-0 rounded-1 border-0 shadow-sm bg-surface">
              <Card.Title className="fs-4 border-bottom border-dark-darker m-0 py-3 py-md-4">{editingId ? (dict.drivershub.gallery.form.titleEditItem || "Edit Gallery Item") : (dict.drivershub.gallery.form.titleNewItem || "Add Gallery Item")}</Card.Title>
              <Card.Body className="p-3 p-md-4 text-start">
                <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold fs-5">{dict.drivershub.gallery.form.title || "Title"}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={dict.drivershub.gallery.form.titlePlaceholder || "Image title"}
                      className="rounded-1 border-0 shadow-sm fw-semibold"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={submitting}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold fs-5">{editingId ? dict.drivershub.gallery.form.imageEdit : dict.drivershub.gallery.form.image}</Form.Label>
                    <Form.Label className="rounded-0 d-flex position-relative m-0">
                      <button className="d-block overflow-hidden position-absolute top-0 end-0 float-none border-0 m-0 bg-primary fw-bold rounded-end-1 fs-6 text-light" style={{ padding: "6px 12px" }}>
                        <Form.Control id="gallery-file-input" className="border-0 rounded-0 opacity-0 d-block position-absolute top-0 end-0" style={{ padding: "6px 12px" }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleGalleryPictureChange} title={galleryFileName ? galleryFileName : settingsDict.modal.profilePicture.placeholder} />{settingsDict.modal.profilePicture.browse}
                      </button>
                      <Form.Control className={`border-0 shadow-sm d-flex rounded-start-1 rounded-end-0 fw-semibold ${galleryFileName ? 'text-theme' : 'text-placeholder'}`} type="text" readOnly value={galleryFileName ? galleryFileName : settingsDict.modal.profilePicture.placeholder} isInvalid={!!galleryPictureFileError} />
                    </Form.Label>
                    {galleryPictureFileError && <p className="text-danger fw-bold m-0 fs-6">{galleryPictureFileError}</p>}
                  </Form.Group>

                  <BSButton variant="primary" type="submit" disabled={submitting} classes="mt-2">
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" /> {editingId ? galleryDict.form.updating : galleryDict.form.saving}
                      </>
                    ) : editingId ? (
                      dict.drivershub.gallery.form.submitEdit || "Update Item"
                    ) : (
                      dict.drivershub.gallery.form.submit || "Add Item"
                    )}
                  </BSButton>

                  {editingId && (
                    <Button
                      variant="danger"
                      className="mt-2 ms-2 rounded-1 text-uppercase fw-bold text-theme"
                      style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
                      onClick={resetForm}
                      disabled={submitting}
                    >
                      {dict.drivershub.gallery.form.cancel || "Cancel"}
                    </Button>
                  )}
                </Form>

                {error && (isRateLimited ? (
                  <div className="mt-3">
                    <RateLimitError dict={dict} secondsRemaining={rateLimitSecondsRemaining ?? 0} onRetry={retryGallery} retryLoading={loading || submitting} />
                  </div>
                ) : (
                  <Alert variant="danger" className="py-2 mt-3 mb-0" dismissible>
                    {error}
                  </Alert>
                ))}
                {success && (
                  <Alert variant="success" className="py-2 mt-3 mb-0" dismissible>
                    {success}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Gallery Items List */}
          <Col xs={12} md={10} lg={6}>
            <Card className="px-0 rounded-1 border-0 shadow-sm bg-surface">
              <Card.Title className="fs-4 border-bottom border-dark-darker m-0 py-3 py-md-4">{dict.drivershub.gallery.card.title || "Gallery Items"}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center column-gap-2">
                    <Spinner animation="border" />
                    <span className="fs-4">{dict.gallery.loading}</span>
                  </div>
                ) : items.length === 0 ? (
                  <p className="text-gray fw-semibold">{dict.errors.gallery.NO_IMAGES_FOUND}</p>
                ) : (
                  <ListGroup variant="flush">
                    {items.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex align-items-center justify-content-between bg-surface flex-wrap row-gap-2 fw-semibold">
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.image_url || "/assets/icons/image-placeholder.png"}
                            alt={item.title || "Gallery image"}
                            width={60}
                            height={60}
                            className="me-3 object-fit-cover rounded-1"
                          />
                          <span>{item.title}</span>
                        </div>
                        <div className="d-flex column-gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-2 rounded-1"
                            onClick={() => handleEdit(item)}
                            title={galleryDict.form.editGalleryItem || "Edit item"}>
                            <FaEdit className="fs-6" />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-2 rounded-1"
                            onClick={() => openConfirmModal(item.id)}
                            title={galleryDict.form.deleteGalleryItem || "Delete item"}>
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
        </Row>
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{dict.drivershub.gallery.modal.title || "Confirm Action"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-item" && (dict.drivershub.gallery.modal.text || "Are you sure you want to delete this gallery item?")}
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" size="md" border="secondary" onClick={() => setShowModal(false)}>
            {dict.drivershub.gallery.modal.cancel || "Cancel"}
          </BSButton>
          <Button variant="danger" className=" text-uppercase fw-bold rounded-1 text-theme" style={{ padding: "0.5rem 1rem", fontSize: "1rem" }} onClick={handleConfirm}>
            {dict.drivershub.gallery.modal.confirm || "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

