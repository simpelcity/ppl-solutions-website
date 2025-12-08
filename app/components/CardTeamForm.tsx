"use client"

import { useEffect, useState } from "react"
import { Card, Form, Button, Image, Spinner, Col } from "react-bootstrap"

type Member = {
  id: number
  name: string
  profile_url?: string | null
  function?: string | null
  role?: string | null
}

export default function CardTeamForm() {
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [functionTitle, setFunctionTitle] = useState("")
  const [roleCode, setRoleCode] = useState("")

  const fetchMembers = async () => {
    try {
      setError(null)
      const res = await fetch("/api/team")
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || `Failed to fetch team (${res.status})`)
      }
      setMembers(json.data || [])
    } catch (err: any) {
      setError(err.message ?? String(err))
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("function", functionTitle)
      formData.append("role", roleCode)
      if (file) formData.append("file", file)
      if (editingId) formData.append("id", editingId.toString())

      const res = await fetch("/api/team", {
        method: editingId ? "PUT" : "POST",
        body: formData,
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`)

      setName("")
      setFile(null)
      setFunctionTitle("")
      setRoleCode("")
      setEditingId(null)
      await fetchMembers()
    } catch (err: any) {
      setError(err.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member? This cannot be undone.")) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Delete failed (${res.status})`)
      await fetchMembers()
    } catch (err: any) {
      setError(err.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: Member) => {
    setName(member.name)
    setFunctionTitle(member.function ?? "")
    setRoleCode(member.role ?? "")
    setEditingId(member.id)
  }

  const handleDeleteProfilePicture = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member's profile picture?")) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Failed to delete profile picture (${res.status})`)

      await fetchMembers()
    } catch (err: any) {
      setError(err.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Col xs={12} md={6} xl={6}>
      <Card className="p-3 my-3">
        <Card.Title>{editingId ? "Edit Member" : "Create New Member"}</Card.Title>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Member Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Member Title (Function)</Form.Label>
              <Form.Select
                value={functionTitle}
                onChange={(e) => {
                  const selected = e.target.value
                  setFunctionTitle(selected)

                  const roleMap: Record<string, string> = {
                    Founder: "founder",
                    "Chief Executive Officer": "ceo",
                    "Chief Administrative Officer": "cao",
                    "Chief Operating Officer": "coo",
                    "Community Manager": "cm",
                    "Human Resources Director": "hrd",
                    "Human Resources": "hr",
                    "Recruitment Team Director": "rtd",
                    "Recruitment Team": "rt",
                    "Event Team Manager": "etm",
                    "Event Team": "et",
                    "Media Team Manager": "mtm",
                    "Media Team": "mt",
                    "Convoy Control Manager": "ccm",
                    "Convoy Control": "cc",
                  }

                  setRoleCode(roleMap[selected] ?? "")
                }}
                required>
                <option value="">Select a role</option>
                <option>Founder</option>
                <option>Chief Executive Officer</option>
                <option>Chief Administrative Officer</option>
                <option>Chief Operating Officer</option>
                <option>Community Manager</option>
                <option>Human Resources Director</option>
                <option>Human Resources</option>
                <option>Recruitment Team Director</option>
                <option>Recruitment Team</option>
                <option>Event Team Manager</option>
                <option>Event Team</option>
                <option>Media Team Manager</option>
                <option>Media Team</option>
                <option>Convoy Control Manager</option>
                <option>Convoy Control</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement
                  setFile(target.files?.[0] ?? null)
                }}
              />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <div className="d-flex align-items-center">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Saving...
                  </>
                ) : editingId ? (
                  "Update Member"
                ) : (
                  "Create Member"
                )}
              </Button>

              {editingId && (
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => {
                    setEditingId(null)
                    setName("")
                    setFile(null)
                  }}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className="team-members mb-3">
        <h5>Team Members</h5>
        {members.length === 0 && <p>No members found.</p>}

        {members.map((member) => (
          <div key={member.id} className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 40, height: 40 }}>
                {member.profile_url ? (
                  <Image src={member.profile_url} roundedCircle width={40} height={40} alt={member.name} />
                ) : (
                  <Image
                    src={"/assets/icons/profile-user.png"}
                    roundedCircle
                    width={40}
                    height={40}
                    alt={member.name}
                  />
                )}
              </div>
              <span>{member.name}</span>
            </div>

            <div className="d-flex align-items-center">
              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(member)}>
                Edit
              </Button>

              <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleDelete(member.id)}>
                Delete
              </Button>

              {member.profile_url && (
                <Button variant="outline-warning" size="sm" onClick={() => handleDeleteProfilePicture(member.id)}>
                  Delete picture
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Col>
  )
}

