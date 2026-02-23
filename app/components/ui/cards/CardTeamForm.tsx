"use client";

import { useState } from "react";
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Badge, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaUserSlash, FaTimes, FaPlus } from "react-icons/fa";
import { BSButton } from "@/components/";
import { useTeam, TeamMember } from "@/app/hooks/useTeam";

type ConfirmAction = "delete-member" | "delete-picture" | null;

type TeamDict = {
  form: {
    titleNewMember: string;
    titleEditMember: string;
    username: string;
    usernamePlaceholder: string;
    profilePicture: string;
    submitNewMember: string;
    submitEditMember: string;
    calcelEditMember: string;
    rolesDepartments: {
      title: string;
      currentRoles: string;
      addRole: string;
      department: string;
      role: string;
    };
  };
  card: {
    title: string;
  };
  modal: {
    title: string;
    textmember: string;
    textPicture: string;
    cancel: string;
    confirm: string;
  };
};

type CardTeamFormProps = {
  dict?: TeamDict;
};

export default function CardTeamForm({ dict }: CardTeamFormProps) {
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
  } = useTeam();

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [targetId, setTargetId] = useState<number | null>(null);

  const resetForm = () => {
    setName("");
    setFile(null);
    setSelectedDepartment("");
    setSelectedRole("");
    setEditingId(null);

    const input = document.getElementById("team-file-input") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMember(name, file);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    await updateMember(editingId, name, file);
    resetForm();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setFile(null);
  };

  const confirm = (action: ConfirmAction, id: number) => {
    setConfirmAction(action);
    setTargetId(id);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!targetId || !confirmAction) return;

    if (confirmAction === "delete-member") await deleteMember(targetId);
    if (confirmAction === "delete-picture") await deleteProfilePicture(targetId);

    setShowModal(false);
    setTargetId(null);
    setConfirmAction(null);
  };

  return (
    <>
      <Col xs={12} md={10} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">{editingId ? (dict?.form?.titleEditMember || "Edit Member") : (dict?.form?.titleNewMember || "Add Member")}</Card.Title>
          <Card.Body>
            <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{dict?.form?.username || "Member Name"}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={dict?.form?.usernamePlaceholder || "Username"}
                  className="rounded-0 border-0 shadow bg-dark-subtle"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{dict?.form?.profilePicture || "Profile Picture (optional)"}</Form.Label>
                <Form.Control
                  id="team-file-input"
                  type="file"
                  accept="image/*"
                  className="rounded-0 border-0 shadow bg-dark-subtle"
                  onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)}
                  disabled={submitting}
                />
              </Form.Group>

              {editingId && (
                <>
                  <hr className="my-4" />
                  <h5 className="mb-3">{dict?.form?.rolesDepartments?.title || "Manage Roles & Departments"}</h5>

                  {loadingRoles ? (
                    <div className="d-flex justify-content-center align-items-center column-gap-2 mb-3">
                      <Spinner animation="border" size="sm" />
                      <span>Loading roles</span>
                    </div>
                  ) : (
                    <>
                      {memberRoles.length > 0 && (
                        <div className="mb-3">
                          <Form.Label>{dict?.form?.rolesDepartments?.currentRoles || "Current Roles:"}</Form.Label>
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

                      <Form.Label>{dict?.form?.rolesDepartments?.addRole || "Add Role:"}</Form.Label>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Select
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          disabled={submitting}>
                          <option value="">{dict?.form?.rolesDepartments?.department || "Select Department"}</option>
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
                          <option value="">{dict?.form?.rolesDepartments?.role || "Select Role"}</option>
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

              {error && (
                <Alert variant="danger" className="py-2" dismissible>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  className="py-2 d-flex align-items-center"
                  dismissible>
                  {success}
                </Alert>
              )}

              <BSButton variant="primary" type="submit" disabled={submitting} classes="mt-2">
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : editingId ? (
                  dict?.form?.submitEditMember || "Update Member"
                ) : (
                  dict?.form?.submitNewMember || "Add Member"
                )}
              </BSButton>

              {editingId && (
                <BSButton
                  variant="secondary"
                  classes="mt-2 ms-2 border-secondary"
                  onClick={resetForm}
                  disabled={submitting}>
                  {dict?.form?.calcelEditMember || "Cancel"}
                </BSButton>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={10} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">{dict?.card?.title || "Team Members"}</Card.Title>
          <Card.Body>
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
                        className="d-flex align-items-center justify-content-center p-2"
                        onClick={() => handleEdit(member)}
                        title="Edit member">
                        <FaEdit className="fs-6" />
                      </Button>
                      {member.profile_url && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="d-flex align-items-center justify-content-center p-2"
                          onClick={() => confirm("delete-picture", member.id)}
                          title="Delete profile picture">
                          <FaUserSlash className="fs-6" />
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center justify-content-center p-2"
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>{dict?.modal?.title || "Confirm Action"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-member" && (dict?.modal?.textmember || "Are you sure you want to delete this member?")}
          {confirmAction === "delete-picture" && (dict?.modal?.textPicture || "Are you sure you want to delete this member's profile picture?")}
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" size="lg" classes="border-secondary" onClick={() => setShowModal(false)}>
            {dict?.modal?.cancel || "Cancel"}
          </BSButton>
          <Button
            variant="danger"
            className="border border-2 border-danger text-uppercase fw-bold rounded-1"
            onClick={handleConfirm}>
            {dict?.modal?.confirm || "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

