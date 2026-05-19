"use client"

import { useEffect, useState } from "react"
import { Row, Col, Card, Image, Spinner } from "react-bootstrap"
import { type Locale } from "@/i18n"
import type { Dictionary } from "@/app/i18n"
import { LoaderSpinner, RateLimitError } from '@/components'
import axios from "axios";
import { parseApiError, useRateLimitState } from "@/hooks/useRateLimitState";

type Role = { id: number; name: string; code: string }
type TeamMember = { id: number; name: string; profile_url?: string | null; profile_path?: string | null }
type Department = { id: number; name: string }

type ApiItem = {
  department: Department
  team_member: TeamMember
  role: Role
}

type PageProps = {
  lang: Locale;
  dict: Dictionary;
}

export default function TeamGrid({ lang, dict }: PageProps) {

  const [items, setItems] = useState<ApiItem[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { isRateLimited, rateLimitSecondsRemaining, clearRateLimitCountdown, applyRateLimit } = useRateLimitState()

  const fetchData = async (mounted: boolean) => {
    try {
      setError(null)
      clearRateLimitCountdown()
      const res = await axios.get(`/api/team?lang=${lang}`)
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_FETCH_TEAM, { cause: res.status })
      const data = res.data
      if (!mounted) return
      setItems(data.team ?? [])
    } catch (err: any) {
      if (!mounted) return
      const parsed = parseApiError(err, dict.errors.team.FAILED_TO_FETCH_TEAM)
      setError(parsed.message)
      applyRateLimit(parsed.rateLimit)
    } finally {
      if (mounted) setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    fetchData(mounted)
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <LoaderSpinner dict={dict}>{dict.team.loading}</LoaderSpinner>;
  if (error) {
    if (isRateLimited) {
      return <RateLimitError dict={dict} secondsRemaining={rateLimitSecondsRemaining ?? 0} onRetry={() => fetchData(true)} retryLoading={loading} />;
    }

    return <div className="text-danger">{dict.errors.team.ERROR_LOADING_TEAM} {error}</div>;
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
        <Row key={idx} className="w-100 d-flex justify-content-center">
          {departments.length === 0 && <Col>{dict.errors.team.NO_DEPTS_OR_MEMBERS_FOUND}</Col>}

          <h2 className="text-primary my-4">{dept.name}</h2>
          <Row className="d-flex justify-content-center row-gap-4">
            {dept.members.map((m, i) => (
              <Col key={i} xs={12} md={6} xl={3}>
                <Card className="h-100 rounded-1 border-0 shadow-sm" data-bs-theme="dark">
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

