"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Container, Dropdown, Row, Col, Image } from "react-bootstrap"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"

interface TeamMember {
  name: string
  profile_url: string | null
  admin: boolean | null
}

interface DashboardProps {
  title: string
  children: React.ReactNode
}

export default function Dashboard({ title, children, ...props }: DashboardProps) {
  const { user, logout, session, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [profileUrl, setProfileUrl] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchProfileAndRole = async () => {
      if (!user?.user_metadata?.username) return

      try {
        const res = await fetch("/api/team")
        if (!res.ok) return

        const { data: members }: { data: TeamMember[] } = await res.json()
        const member = members.find((m) => m.name === user.user_metadata?.username)
        if (!member?.profile_url) return

        setProfileUrl(member.profile_url)
        setIsAdmin(member.admin === true)
      } catch (err) {
        console.error("Failed to fetch team profile:", err)
      }
    }

    fetchProfileAndRole()

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [user, pathname])

  const handleLogout = async () => {
    if (!logout) return
    await logout()
    router.push("/")
  }

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login")
    }
  }, [session, loading, router])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (!session) {
    return null
  }

  const username = (session as any).user?.user_metadata?.username || session.user.email

  return (
    <>
      <div className="sidebar-wrapper w-25 d-flex flex-column justify-content-between bg-light bg-opacity-25">
        <ul className="sidebar list-unstyled">
          <li className="sidebar-header bg-light bg-opacity-10 py-3 px-3">
            <a
              href="#"
              className="text-light d-flex align-items-center justify-content-between text-decoration-none column-gap-2">
              <h3 className="m-0">Dashboard</h3>
              <HiOutlineSwitchHorizontal />
            </a>
          </li>
          <li className="sidebar-title text-uppercase text-light text-opacity-25 fw-bold mt-3 mb-2 ps-3 text-start">
            navigation
          </li>
          <li className="sidebar-list text-start ps-4">
            <a href="/drivershub" className="text-decoration-none text-light">
              <span>Drivershub</span>
            </a>
          </li>
          {isAdmin && (
            <>
              <li className="sidebar-list text-start ps-4 ">
                <a href="/drivershub/dashboard" className="text-decoration-none text-light">
                  <span>Dashboard</span>
                </a>
              </li>
            </>
          )}
        </ul>
        <div className="sidebar-footer bg-light bg-opacity-10 py-2 px-3">
          <Row className="w-100">
            <Col xs={4}>
              <a href="https://github.com/simpelcity" target="_blank" className="text-decoration-none">
                Github
              </a>
            </Col>
            <Col xs={4}>
              <a href="https://simpelcity.github.io/" target="_blank" className="text-decoration-none">
                About
              </a>
            </Col>
            <Col xs={4}>
              <a href="/contact" className="text-decoration-none">
                Support
              </a>
            </Col>
          </Row>
        </div>
      </div>
      <Container className="px-0" fluid>
        <div className="bg-light bg-opacity-25 d-flex justify-content-between align-items-center py-1 px-3">
          <div className="d-flex flex-column align-items-start">
            <h3 className="mb-0">{title}</h3>
            <p className="mb-0 fs-6">{title} / Drivershub</p>
          </div>
          <div className="d-flex">
            <Dropdown data-bs-theme="dark">
              <Dropdown.Toggle variant="dark" className="bg-transparent border-0 p-0 d-flex align-items-center">
                <Image
                  src={profileUrl ?? "/assets/icons/profile-user.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  roundedCircle
                />
                <span className="d-lg-none ms-2 me-1 mt-1 fs-5 fw-semibold">Profile</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="position-absolute mt-2">
                <Dropdown.Item disabled className="fw-bold text-light">
                  {username}
                </Dropdown.Item>
                <Dropdown.Item href="/drivershub/profile">Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="content-wrapper d-flex justify-content-center align-items-center">{children}</div>
      </Container>
    </>
  )
}

