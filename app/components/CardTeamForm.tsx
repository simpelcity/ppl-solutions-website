"use client"

import { useEffect, useState } from "react"
import { Card, Form, Button, Image } from "react-bootstrap"

type Member = {
  id: number
  name: string
  profile_url?: string
}

export default function CardTeamForm() {
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team")
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setMembers(json.data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // Handle create or edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      if (file) formData.append("file", file)
      if (editingId) formData.append("id", editingId.toString())

      const res = await fetch("/api/team", {
        method: editingId ? "PUT" : "POST",
        body: formData,
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      setName("")
      setFile(null)
      setEditingId(null)
      fetchMembers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      fetchMembers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Edit button
  const handleEdit = (member: Member) => {
    setName(member.name)
    setEditingId(member.id)
  }

  return (
    <Card className="p-3">
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

          <Button type="submit" disabled={loading}>
            {editingId ? "Update Member" : "Create Member"}
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
        </Form>

        <hr />

        <h5>Team Members</h5>
        {members.length === 0 && <p>No members found.</p>}
        {members.map((member) => (
          <div key={member.id} className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              {member.profile_url && (
                <Image src={member.profile_url} roundedCircle width={40} height={40} alt={member.name} />
              )}
              <span>{member.name}</span>
            </div>
            <div>
              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(member)}>
                Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(member.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}

