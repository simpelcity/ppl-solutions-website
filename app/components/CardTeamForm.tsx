"use client"

import { useState, useEffect } from "react"
import { Card, Form, Col, Button, Alert, Spinner, ListGroup, Image, Badge, Modal } from "react-bootstrap"
import { FaEdit, FaTrash, FaUserSlash, FaTimes, FaPlus } from "react-icons/fa"
import { ButtonPrimary, ButtonSecondary } from "@/components"

interface TeamMember {
  id: number
  name: string
  profile_url?: string | null
}

interface Department {
  id: number
  name: string
}

interface Role {
  id: number
  name: string
  code: string
}

interface MemberRole {
  team_member_id: number
  department: Department
  role: Role
}

type ConfirmAction = "delete-member" | "delete-picture" | null

export default function CardTeamForm() {
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [show, setShow] = useState(true)

  const [departments, setDepartments] = useState<Department[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [loadingRoles, setLoadingRoles] = useState(false)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [targetId, setTargetId] = useState<number | null>(null)

  useEffect(() => {
    fetchMembers()
    fetchDepartments()
    fetchRoles()
  }, [])

  useEffect(() => {
    if (editingId) {
      fetchMemberRoles(editingId)
    } else {
      setMemberRoles([])
    }
  }, [editingId])

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments")
      const json = await res.json()
      if (res.ok) setDepartments(json.data || [])
    } catch (err) {
      console.error("Failed to fetch departments:", err)
    }
  }

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles")
      const json = await res.json()
      if (res.ok) setRoles(json.data || [])
    } catch (err) {
      console.error("Failed to fetch roles:", err)
    }
  }

  const fetchMemberRoles = async (memberId: number) => {
    setLoadingRoles(true)
    try {
      const res = await fetch(`/api/team/roles?memberId=${memberId}`)
      const json = await res.json()
      if (res.ok) setMemberRoles(json.data || [])
    } catch (err) {
      console.error("Failed to fetch member roles:", err)
    } finally {
      setLoadingRoles(false)
    }
  }

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/team/members")
      const json = await res.json()
      if (res.ok) {
        const items = (json.data || []) as TeamMember[]
        setMembers(items)
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
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    const fd = new FormData()
    fd.append("name", name.trim())
    if (file) fd.append("file", file)

    setSubmitting(true)
    try {
      const res = await fetch("/api/team", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to add member")
      }
      setSuccess("Team member added successfully!")
      setName("")
      setFile(null)
      const fileInput = document.getElementById("team-file-input") as HTMLInputElement | null
      if (fileInput) fileInput.value = ""
      fetchMembers()
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error")
    } finally {
      setSubmitting(false)
    }
  }

  const openConfirmModal = (action: ConfirmAction, id: number) => {
    setConfirmAction(action)
    setTargetId(id)
    setShowModal(true)
  }

  const handleConfirm = async () => {
    setShowModal(false)
    if (!targetId || !confirmAction) return

    if (confirmAction === "delete-member") {
      await executeDeleteMember(targetId)
    } else if (confirmAction === "delete-picture") {
      await executeDeleteProfilePicture(targetId)
    }

    setTargetId(null)
    setConfirmAction(null)
  }

  const executeDeleteMember = async (id: number) => {
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || "Failed to delete")
      }
      setSuccess("Member deleted successfully!")
      fetchMembers()
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete member")
    }
  }

  const executeDeleteProfilePicture = async (id: number) => {
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || "Failed to delete picture")
      }
      setSuccess("Profile picture deleted successfully!")
      fetchMembers()
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete profile picture")
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setName(member.name || "")
    setFile(null)
    setSelectedDepartment("")
    setSelectedRole("")
  }

  const handleAddRole = async () => {
    if (!editingId || !selectedDepartment || !selectedRole) {
      setError("Please select both department and role")
      return
    }

    try {
      const res = await fetch("/api/team/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_member_id: editingId,
          department_id: parseInt(selectedDepartment),
          role_id: parseInt(selectedRole),
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || "Failed to add role")
      }

      setSuccess("Role added successfully!")
      setSelectedDepartment("")
      setSelectedRole("")
      fetchMemberRoles(editingId)
    } catch (err: any) {
      setError(err?.message ?? "Failed to add role")
    }
  }

  const handleRemoveRole = async (departmentId: number, roleId: number) => {
    if (!editingId) return

    try {
      const res = await fetch("/api/team/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_member_id: editingId,
          department_id: departmentId,
          role_id: roleId,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error || "Failed to remove role")
      }

      setSuccess("Role removed successfully!")
      fetchMemberRoles(editingId)
    } catch (err: any) {
      setError(err?.message ?? "Failed to remove role")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setError(null)
    setSuccess(null)
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    const fd = new FormData()
    fd.append("id", editingId.toString())
    fd.append("name", name.trim())
    if (file) fd.append("file", file)

    setSubmitting(true)
    try {
      const res = await fetch("/api/team", { method: "PUT", body: fd })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to update")
      }
      setSuccess("Member updated successfully!")
      setName("")
      setFile(null)
      setEditingId(null)
      const fileInput = document.getElementById("team-file-input") as HTMLInputElement | null
      if (fileInput) fileInput.value = ""
      fetchMembers()
    } catch (err: any) {
      setError(err?.message ?? "Failed to update member")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Col xs={12} md={6} xl={6}>
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">{editingId ? "Edit Member" : "Add Member"}</Card.Title>
          <Card.Body>
            <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Member Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  className="rounded-0 border-0 shadow bg-dark-subtle"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Profile Picture (optional)</Form.Label>
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
                  <h5 className="mb-3">Manage Roles & Departments</h5>

                  {loadingRoles ? (
                    <div className="d-flex justify-content-center align-items-center column-gap-2 mb-3">
                      <Spinner animation="border" size="sm" />
                      <span>Loading roles</span>
                    </div>
                  ) : (
                    <>
                      {memberRoles.length > 0 && (
                        <div className="mb-3">
                          <Form.Label>Current Roles:</Form.Label>
                          <div className="d-flex flex-wrap gap-2">
                            {memberRoles.map((mr, idx) => (
                              <Badge key={idx} bg={mr.role.code} className="d-flex align-items-center gap-2 p-2">
                                <span>
                                  {mr.department.name} - {mr.role.name}
                                </span>
                                <FaTimes
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleRemoveRole(mr.department.id, mr.role.id)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Form.Label>Add Role:</Form.Label>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Select
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          disabled={submitting}>
                          <option value="">Select Department</option>
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
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </Form.Select>

                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleAddRole}
                          disabled={!selectedDepartment || !selectedRole || submitting}>
                          <FaPlus />
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {error && (
                <Alert variant="danger" className="py-2" onClose={() => setShow(false)} dismissible>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  className="py-2 d-flex align-items-center"
                  onClose={() => setShow(false)}
                  dismissible>
                  {success}
                </Alert>
              )}

              <ButtonPrimary type="submit" disabled={submitting} classes="mt-2">
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : editingId ? (
                  "Update Member"
                ) : (
                  "Add Member"
                )}
              </ButtonPrimary>

              {editingId && (
                <ButtonSecondary
                  classes="mt-2 ms-2 border-secondary"
                  onClick={() => {
                    setEditingId(null)
                    setName("")
                    setFile(null)
                    setSelectedDepartment("")
                    setSelectedRole("")
                    setMemberRoles([])
                    const fileInput = document.getElementById("team-file-input") as HTMLInputElement | null
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

      <Col xs={12} md={6} xl={6}>
        {/* Members List */}
        <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
          <Card.Title className="fs-4">Team Members</Card.Title>
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
                    className="d-flex align-items-center justify-content-between bg-dark text-light border-dark-subtle">
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
                          onClick={() => openConfirmModal("delete-picture", member.id)}
                          title="Delete profile picture">
                          <FaUserSlash className="fs-6" />
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center justify-content-center p-2"
                        onClick={() => openConfirmModal("delete-member", member.id)}
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

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction === "delete-member" && "Are you sure you want to delete this member?"}
          {confirmAction === "delete-picture" && "Are you sure you want to delete this member's profile picture?"}
        </Modal.Body>
        <Modal.Footer>
          <ButtonSecondary classes="border-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </ButtonSecondary>
          <Button
            variant="danger"
            className="border border-2 border-danger text-uppercase fw-bold rounded-1"
            onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

