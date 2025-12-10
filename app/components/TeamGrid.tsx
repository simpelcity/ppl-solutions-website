"use client"

import React, { useEffect, useState } from "react"
import { Row, Col, Card, ListGroup, Image, Spinner } from "react-bootstrap"

type Role = { id: number; name: string; code: string }
type TeamMember = { id: number; name: string; profile_url?: string | null; profile_path?: string | null }
type Department = { id: number; name: string }

type ApiItem = {
  department: Department
  team_member: TeamMember
  role: Role
}

export default function TeamGrid() {
  const [items, setItems] = useState<ApiItem[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const res = await fetch("/api/team")
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const json = await res.json()
        if (!mounted) return
        setItems(json.data ?? [])
      } catch (err: any) {
        console.error("Failed to fetch team data", err)
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" /> Loading team...
      </div>
    )
  }

  if (error) {
    return <div className="text-danger">Error loading team: {error}</div>
  }

  const departmentsMap: Record<number, { name: string; members: { member: TeamMember; role: Role }[] }> = {}
  ;(items || []).forEach((it) => {
    if (!it || !it.department || !it.team_member || !it.role) return
    const deptId = it.department.id
    if (!departmentsMap[deptId]) departmentsMap[deptId] = { name: it.department.name, members: [] }
    departmentsMap[deptId].members.push({ member: it.team_member, role: it.role })
  })

  const departments = Object.values(departmentsMap)

  return (
    <Row className="w-100 mt-3 row-gap-4">
      {departments.length === 0 && <Col>No departments / members found.</Col>}

      {departments.map((dept, idx) => (
        <Card key={idx} className="border-0 rounded-0 shadow" data-bs-theme="dark">
          <Card.Header className="bg-dark">
            <strong>{dept.name}</strong>
          </Card.Header>
          <ListGroup variant="flush">
            {dept.members.map((m, i) => (
              <ListGroup.Item key={i} className="d-flex align-items-center gap-3">
                <Image
                  src={m.member.profile_url ?? "/assets/icons/profile-user.png"}
                  alt={m.member.name}
                  width={48}
                  height={48}
                  roundedCircle
                />
                <div className="flex-grow-1 text-start">
                  <div className="fw-semibold">{m.member.name}</div>
                  <div className={`small ${m.role.code}`}>{m.role.name}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      ))}
    </Row>
  )
}

