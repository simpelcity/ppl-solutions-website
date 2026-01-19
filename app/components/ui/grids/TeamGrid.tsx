"use client"

import { useEffect, useState } from "react"
import { Row, Col, Card, Image, Spinner } from "react-bootstrap"
import { type Locale } from "@/i18n"

type Role = { id: number; name: string; code: string }
type TeamMember = { id: number; name: string; profile_url?: string | null; profile_path?: string | null }
type Department = { id: number; name: string }

type ApiItem = {
  department: Department
  team_member: TeamMember
  role: Role
}

export default function TeamGrid({ lang, teamDict }: { lang: Locale; teamDict: { loading: string; error: string } }) {

  const [items, setItems] = useState<ApiItem[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/team?lang=${lang}`)
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
      <div className="text-center text-light p-3 d-flex align-items-center column-gap-2">
        <Spinner animation="border" /> {teamDict.loading}
      </div>
    )
  }

  if (error) {
    return <div className="text-danger">{teamDict.error} {error}</div>
  }

  const departmentsMap: Record<number, { name: string; members: { member: TeamMember; role: Role }[] }> = {}
    ; (items || []).forEach((it) => {
      if (!it || !it.department || !it.team_member || !it.role) return
      const deptId = it.department.id
      if (!departmentsMap[deptId]) departmentsMap[deptId] = { name: it.department.name, members: [] }
      departmentsMap[deptId].members.push({ member: it.team_member, role: it.role })
    })

  const departments = Object.values(departmentsMap)

  return (
    <>
      {departments.map((dept, idx) => (
        <Row key={idx} className="w-100 d-flex justify-content-center row-gap-4">
          {departments.length === 0 && <Col>No departments / members found.</Col>}

          <h2 className="text-primary my-4">{dept.name}</h2>
          <Row className="d-flex justify-content-center row-gap-4">
            {dept.members.map((m, i) => (
              <Col key={i} xs={12} md={6} xl={3}>
                <Card className="h-100 rounded-0 border-0 shadow" data-bs-theme="dark">
                  <Card.Body className="p-4">
                    <Image
                      src={m.member.profile_url ?? "/assets/icons/profile-user.png"}
                      alt={m.member.name}
                      width={150}
                      height={150}
                      roundedCircle
                    />
                    <Card.Title className="fs-3 mt-2">{m.member.name}</Card.Title>
                    <Card.Text className={`${m.role.code}`}>{m.role.name}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Row>
      ))}
    </>
  )
}

