"use client";

import { useState, type ChangeEvent } from "react";
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Badge, Modal, Row, Container } from "react-bootstrap";
import { FaEdit, FaTrash, FaUserSlash, FaTimes, FaPlus } from "react-icons/fa";
import { BSButton, TeamForm } from "@/components";
import { useTeam, TeamMember } from "@/hooks/useTeam";
import type { Dictionary } from "@/app/i18n"
import { useTheme } from "next-themes";

type ConfirmAction = "delete-member" | "delete-picture" | null;

type CardTeamFormProps = {
  dict: Dictionary;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export default function CardTeamForm({ dict }: CardTeamFormProps) {
  const teamDict = dict.drivershub.dashboard.team;
  const settingsDict = dict.drivershub.profile.settingsPage;

  const { resolvedTheme } = useTheme();

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
    isRateLimited,
    rateLimitSecondsRemaining,
    success,
    setEditingId,
    createMember,
    updateMember,
    deleteMember,
    deleteProfilePicture,
    addRole,
    removeRole,
    retryTeamData,
  } = useTeam(dict);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [profilePictureFileError, setProfilePictureFileError] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");


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

    const input = document.getElementById("pfp-file-input") as HTMLInputElement | null;
    if (input) input.value = "";
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
    resetForm();
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
            <TeamForm dict={dict} />
          </Col>

          <Col xs={12} md={10} lg={6}>
            <Card className="px-0 rounded-1 border-0 shadow-sm bg-surface">
              <Card.Title className="fs-4 border-bottom py-3 py-md-4 m-0">{teamDict.card.title || "Team Members"}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center column-gap-2">
                    <Spinner animation="border" />
                    <span className="fs-4">{teamDict.form.loading}</span>
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-gray fw-semibold">{dict.errors.members.NO_MEMBERS_FOUND}</p>
                ) : (
                  <ListGroup variant="flush">
                    {members.map((member) => (
                      <ListGroup.Item
                        key={member.id}
                        className="d-flex align-items-center justify-content-between bg-surface flex-wrap row-gap-2">
                        <div className="d-flex align-items-center">
                          <Image
                            src={member.profile_url || `/assets/icons/${resolvedTheme}/default-user.png`}
                            alt={dict.drivershub.profile.profilePage.card.profilePictureAlt.replace("{driver}", member.name)}
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
                            title={teamDict.form.editMember || "Edit Member"}>
                            <FaEdit className="fs-6" />
                          </Button>
                          {member.profile_url && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="d-flex align-items-center justify-content-center p-2 rounded-1"
                              onClick={() => confirm("delete-picture", member.id)}
                              title={teamDict.form.deletePfp || "Delete profile picture"}>
                              <FaUserSlash className="fs-6" />
                            </Button>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="d-flex align-items-center justify-content-center p-2 rounded-1"
                            onClick={() => confirm("delete-member", member.id)}
                            title={teamDict.form.deleteMember || "Delete member"}>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{teamDict.modal.title || "Confirm Action"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-member" && (teamDict.modal.textmember || "Are you sure you want to delete this member?")}
          {confirmAction === "delete-picture" && (teamDict.modal.textPicture || "Are you sure you want to delete this member's profile picture?")}
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" size="lg" classes="border-secondary" onClick={() => setShowModal(false)}>
            {teamDict.modal.cancel || "Cancel"}
          </BSButton>
          <Button variant="danger" className=" text-uppercase fw-bold rounded-1 text-theme" style={{ padding: "0.5rem 1rem", fontSize: "1rem" }} onClick={handleConfirm}>
            {teamDict.modal.confirm || "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

