"use client";

import { useState, type ChangeEvent } from "react";
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Badge, Modal, Row, Container } from "react-bootstrap";
import { FaEdit, FaTrash, FaUserSlash, FaTimes, FaPlus } from "react-icons/fa";
import { BSButton } from "@/components";
import { useTeam, TeamMember } from "@/hooks/useTeam";
import type { Dictionary } from "@/app/i18n"

type ConfirmAction = "delete-member" | "delete-picture" | null;

type CardTeamFormProps = {
  dict: Dictionary;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export default function CardTeamForm({ dict }: CardTeamFormProps) {
  const teamDict = dict.drivershub.team;
  const settingsDict = dict.drivershub.profile.settingsPage;

  const {
    members,
    departments,
    roles,
    memberRoles,
    loading,
    loadingRoles,
    submitting,
    editingId,
    error,
    success,
    setEditingId,
    createMember,
    updateMember,
    deleteMember,
    deleteProfilePicture,
    addRole,
    removeRole,
  } = useTeam(dict);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [profilePictureFileError, setProfilePictureFileError] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");

  const [pfpPreviewUrl, setPfpPreviewUrl] = useState<string | null>(null);

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

  function handleProfilePictureChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setProfilePictureFileError(null);
      return;
    }

    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      setFile(null);
      setProfilePictureFileError(validationError);
      return;
    }

    const preview = URL.createObjectURL(selectedFile);
    setPfpPreviewUrl(preview);

    setProfilePictureFileError(null);
    setFile(selectedFile);
    setProfileFileName(selectedFile.name);
  };

  function resetForm() {
    setName("");
    setFile(null);
    setSelectedDepartment("");
    setSelectedRole("");
    setProfileFileName("");
    setProfilePictureFileError(null);
    setEditingId(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfilePictureFileError(null);

    try {
      await createMember(name, file);
      
      resetForm();
    } catch (err: any) {
      const message = err?.message || dict.errors.UNEXPECTED;
      setProfilePictureFileError(message);
    }
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfilePictureFileError(null);

    try {
      if (!editingId) return;
      await updateMember(editingId, name, file);

      resetForm();
    } catch (err: any) {
      const message = err?.message || dict.errors.UNEXPECTED;
      setProfilePictureFileError(message);
    }
  };

  function handleEdit(member: TeamMember) {
    setEditingId(member.id);
    setName(member.name);
    setFile(null);
  };

  function confirm(action: ConfirmAction, id: number) {
    setConfirmAction(action);
    setTargetId(id);
    setShowModal(true);
  };

  async function handleConfirm() {
    if (!targetId || !confirmAction) return;

    if (confirmAction === "delete-member") await deleteMember(targetId);
    if (confirmAction === "delete-picture") await deleteProfilePicture(targetId);

    setShowModal(false);
    setTargetId(null);
    setConfirmAction(null);
  };

  return (
    <>
      <Container className="p-3 p-md-4" fluid>
        <Row className="row-gap-3 row-gap-md-4 d-flex justify-content-center">
          <Col xs={12} md={10} lg={6}>
            <Card className="px-0 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
              <Card.Title className="fs-4 border-bottom border-dark-subtle m-0 py-3 py-md-4">{editingId ? (dict.drivershub.team.form.titleEditMember || "Edit Member") : (dict.drivershub.team.form.titleNewMember || "Add Member")}</Card.Title>
              <Card.Body className="p-3 p-md-4 text-start">
                <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold fs-5">{dict.drivershub.team.form.username || "Member Name"}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={dict.drivershub.team.form.usernamePlaceholder || "Username"}
                      className="rounded-0 border-0 shadow-sm bg-dark-subtle"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                    />
                  </Form.Group>

                  <Form.Group controlId="profilePicture" className="mb-3">
                    <Form.Label className="fw-bold fs-5">{teamDict.form.profilePicture}</Form.Label>
                    <Form.Label className="rounded-0 d-flex position-relative m-0">
                      <button className="d-block overflow-hidden position-absolute top-0 end-0 float-none border-0 m-0 bg-primary fw-bold rounded-end-1 fs-6" style={{ padding: "6px 12px" }}>
                        <Form.Control className="border-0 rounded-0 opacity-0 d-block position-absolute top-0 end-0" style={{ padding: "6px 12px" }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfilePictureChange} title={profileFileName ? profileFileName : settingsDict.modal.profilePicture.placeholder} />{settingsDict.modal.profilePicture.browse}
                      </button>
                      <Form.Control className="border-0 bg-dark-subtle shadow-none d-flex rounded-start-1 rounded-end-0 fw-semibold" type="text" readOnly value={profileFileName ? profileFileName : settingsDict.modal.profilePicture.placeholder} isInvalid={!!profilePictureFileError} />
                    </Form.Label>
                    {profilePictureFileError && <p className="text-danger fw-bold m-0 fs-6">{profilePictureFileError}</p>}
                  </Form.Group>

                  {editingId && (
                    <>
                      <hr className="my-4" />
                      <h5 className="mb-3">{dict.drivershub.team.form.rolesDepartments?.title || "Manage Roles & Departments"}</h5>

                      {loadingRoles ? (
                        <div className="d-flex justify-content-center align-items-center column-gap-2 mb-3">
                          <Spinner animation="border" size="sm" />
                          <span>Loading roles</span>
                        </div>
                      ) : (
                        <>
                          {memberRoles.length > 0 && (
                            <div className="mb-3">
                              <Form.Label>{dict.drivershub.team.form.rolesDepartments?.currentRoles || "Current Roles:"}</Form.Label>
                              <div className="d-flex flex-wrap gap-2">
                                {memberRoles.map((mr, idx) => (
                                  <Badge key={idx} bg={mr.role.code} className="d-flex align-items-center gap-2 p-2">
                                    <span>
                                      {mr.department.name} - {mr.role.name}
                                    </span>
                                    <FaTimes
                                      style={{ cursor: "pointer" }}
                                      onClick={() => removeRole(editingId, mr.department.id, mr.role.id)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <Form.Label>{dict.drivershub.team.form.rolesDepartments?.addRole || "Add Role:"}</Form.Label>
                          <div className="d-flex gap-2 mb-3">
                            <Form.Select
                              value={selectedDepartment}
                              onChange={(e) => setSelectedDepartment(e.target.value)}
                              disabled={submitting}>
                              <option value="">{dict.drivershub.team.form.rolesDepartments?.department || "Select Department"}</option>
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                  {dept.name}
                                </option>
                              ))}
                            </Form.Select>

                            <Form.Select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              disabled={submitting}>
                              <option value="">{dict.drivershub.team.form.rolesDepartments?.role || "Select Role"}</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </Form.Select>

                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => addRole(editingId, Number(selectedDepartment), Number(selectedRole))}
                              disabled={!selectedDepartment || !selectedRole || submitting}>
                              <FaPlus />
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <BSButton variant="primary" type="submit" disabled={submitting || profilePictureFileError} classes="mt-2">
                    {submitting ? (
                      <>
                        {editingId ? teamDict.form.updating : teamDict.form.saving}
                      </>
                    ) : editingId ? (
                      dict.drivershub.team.form.submitEditMember || "Update Member"
                    ) : (
                      dict.drivershub.team.form.submitNewMember || "Add Member"
                    )}
                  </BSButton>

                  {editingId && (
                    <BSButton
                      variant="secondary"
                      classes="mt-2 ms-2 border-secondary"
                      onClick={resetForm}
                      disabled={submitting}>
                      {dict.drivershub.team.form.cancelEditMember || "Cancel"}
                    </BSButton>
                  )}
                </Form>
                {error && (
                  <Alert variant="danger" className="py-2 mt-3 mb-0" dismissible>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    variant="success"
                    className="py-2 mt-3 mb-0"
                    dismissible>
                    {success}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={10} lg={6}>
            <Card className="px-0 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
              <Card.Title className="fs-4 border-bottom border-dark-subtle py-3 py-md-4 m-0">{dict.drivershub.team.card.title || "Team Members"}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center column-gap-2">
                    <Spinner animation="border" />
                    <span className="fs-4">Loading team members</span>
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-muted">No members yet</p>
                ) : (
                  <ListGroup variant="flush">
                    {members.map((member) => (
                      <ListGroup.Item
                        key={member.id}
                        className="d-flex align-items-center justify-content-between bg-dark text-light border-dark-subtle flex-wrap row-gap-2">
                        <div className="d-flex align-items-center">
                          <Image
                            src={member.profile_url || "/assets/icons/profile-user.png"}
                            alt={member.name}
                            width={40}
                            height={40}
                            roundedCircle
                            className="me-3"
                          />
                          <span>{member.name}</span>
                        </div>
                        <div className="d-flex column-gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-2 rounded-1"
                            onClick={() => handleEdit(member)}
                            title="Edit member">
                            <FaEdit className="fs-6" />
                          </Button>
                          {member.profile_url && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="d-flex align-items-center justify-content-center p-2 rounded-1"
                              onClick={() => confirm("delete-picture", member.id)}
                              title="Delete profile picture">
                              <FaUserSlash className="fs-6" />
                            </Button>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-2 rounded-1"
                            onClick={() => confirm("delete-member", member.id)}
                            title="Delete member">
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>{dict.drivershub.team.modal.title || "Confirm Action"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-member" && (dict.drivershub.team.modal.textmember || "Are you sure you want to delete this member?")}
          {confirmAction === "delete-picture" && (dict.drivershub.team.modal.textPicture || "Are you sure you want to delete this member's profile picture?")}
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" size="lg" classes="border-secondary" onClick={() => setShowModal(false)}>
            {dict.drivershub.team.modal.cancel || "Cancel"}
          </BSButton>
          <Button
            variant="danger"
            className="border border-2 border-danger text-uppercase fw-bold rounded-1"
            onClick={handleConfirm}>
            {dict.drivershub.team.modal.confirm || "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

