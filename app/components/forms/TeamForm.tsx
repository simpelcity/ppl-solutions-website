'use client'

import { useState, type ChangeEvent } from "react";
import { Card, Form, Spinner, Badge, Button, Alert } from 'react-bootstrap'
import { FaEdit, FaTrash, FaUserSlash, FaTimes, FaPlus } from "react-icons/fa";
import { BSButton, RateLimitError } from "@/components";
import { useTeam, TeamMember } from "@/hooks/useTeam";
import type { Dictionary } from "@/app/i18n"
import { useTheme } from "next-themes";

type ConfirmAction = "delete-member" | "delete-picture" | null;

type Props = {
  dict: Dictionary;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export default function TeamForm({ dict }: Props) {
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
      status,
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

  if (error && status === 403) {
    return (
      <div className="text-danger text-center d-flex align-items-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error}</div>
    )
  }

  return (
    <>
      <Card className="px-0 rounded-1 border-0 shadow-sm bg-surface">
        <Card.Title className="fs-4 border-bottom m-0 py-3 py-md-4">{editingId ? (teamDict.form.titleEditMember || "Edit Member") : (teamDict.form.titleNewMember || "Add Member")}</Card.Title>
        <Card.Body className="p-3 p-md-4 text-start">
          <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold fs-5">{teamDict.form.username || "Member Name"}</Form.Label>
              <Form.Control
                type="text"
                placeholder={teamDict.form.usernamePlaceholder || "Username"}
                className="rounded-1 border-0 shadow-sm fw-semibold"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold fs-5">{teamDict.form.profilePicture}</Form.Label>
              <Form.Label className="rounded-0 d-flex position-relative m-0">
                <button className="d-block overflow-hidden position-absolute top-0 end-0 float-none border-0 m-0 bg-primary fw-bold rounded-end-1 fs-6 text-light" style={{ padding: "6px 12px" }}>
                  <Form.Control id="pfp-file-input" className="border-0 rounded-0 opacity-0 d-block position-absolute top-0 end-0" style={{ padding: "6px 12px" }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfilePictureChange} title={profileFileName ? profileFileName : settingsDict.modal.profilePicture.placeholder} />{settingsDict.modal.profilePicture.browse}
                </button>
                <Form.Control className={`border-0 shadow-sm d-flex rounded-start-1 rounded-end-0 fw-semibold ${profileFileName ? 'text-light' : 'text-placeholder'}`} type="text" readOnly value={profileFileName ? profileFileName : settingsDict.modal.profilePicture.placeholder} isInvalid={!!profilePictureFileError} />
              </Form.Label>
              {profilePictureFileError && <p className="text-danger fw-bold m-0 fs-6">{profilePictureFileError}</p>}
            </Form.Group>

            {editingId && (
              <>
                <hr className="my-4" />
                <h5 className="mb-3">{teamDict.form.rolesDepartments?.title || "Manage Roles & Departments"}</h5>

                {loadingRoles ? (
                  <div className="d-flex justify-content-center align-items-center column-gap-2 mb-3">
                    <Spinner animation="border" size="sm" />
                    <span>{teamDict.form.rolesDepartments.loading}</span>
                  </div>
                ) : (
                  <>
                    {memberRoles.length > 0 && (
                      <div className="mb-3">
                        <Form.Label className="fw-bold">{teamDict.form.rolesDepartments?.currentRoles || "Current Roles:"}</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                          {memberRoles.map((mr, idx) => (
                            <Badge key={idx} bg={mr.role.code} className="d-flex align-items-center gap-2 p-2 rounded-1">
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

                    <Form.Label className="fw-bold">{teamDict.form.rolesDepartments?.addRole || "Add Role:"}</Form.Label>
                    <div className="d-flex gap-2 mb-3">
                      <Form.Select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        disabled={submitting}
                        className="rounded-1 border-0 shadow-sm text-theme">
                        <option>{teamDict.form.rolesDepartments?.department || "Select Department"}</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        disabled={submitting}
                        className="rounded-1 border-0 shadow-sm text-theme">
                        <option>{teamDict.form.rolesDepartments?.role || "Select Role"}</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </Form.Select>

                      <Button
                        variant="success"
                        size="sm"
                        className="rounded-1"
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
                teamDict.form.submitEditMember || "Update Member"
              ) : (
                teamDict.form.submitNewMember || "Add Member"
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
                {teamDict.form.cancelEditMember || "Cancel"}
              </Button>
            )}
          </Form>
          {error && (isRateLimited ? (
            <div className="mt-3">
              <RateLimitError dict={dict} secondsRemaining={rateLimitSecondsRemaining ?? 0} onRetry={retryTeamData} retryLoading={loading || submitting} />
            </div>
          ) : (
            <Alert variant="danger" className="py-2 mt-3 mb-0" dismissible>
              {error}
            </Alert>
          ))}
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
    </>
  )
}
