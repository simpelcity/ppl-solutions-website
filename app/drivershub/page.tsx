"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, Dropdown, Image } from "react-bootstrap"
import { StartBanner, TableJobs } from "@/components"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import "@/styles/Drivershub.scss"

interface TeamMember {
  name: string
  profile_url: string | null
  admin: boolean | null
}

export default function DriversHubPage() {
  const { user, logout, session, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [profileUrl, setProfileUrl] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchProfileAndRole = async () => {
      if (!user?.user_metadata?.username) return // safe check

      try {
        const res = await fetch("/api/team")
        if (!res.ok) return

        const { data: members }: { data: TeamMember[] } = await res.json()
        const member = members.find((m) => m.name === user.user_metadata?.username) // optional chaining
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
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <div className="sidebar-wrapper w-25 d-flex flex-column justify-content-between bg-light bg-opacity-25">
            <ul className="sidebar list-unstyled">
              <li className="sidebar-header bg-light bg-opacity-10 py-2 px-3">
                <a
                  href="#"
                  className="text-light d-flex align-items-center justify-content-between text-decoration-none column-gap-2">
                  <h3 className="m-0">Dashboard</h3>
                  <HiOutlineSwitchHorizontal />
                </a>
              </li>
              <li className="sidebar-list text-start px-3 mt-3">
                <a href="#" className="text-decoration-none">
                  <span>Dashboard</span>
                </a>
              </li>
              <li className="sidebar-list text-start px-3">
                <a href="#" className="text-decoration-none">
                  <span>Tables</span>
                </a>
              </li>
            </ul>
            <div className="sidebar-footer bg-light bg-opacity-10 py-2 px-3">
              <Row className="w-100">
                <Col xs={4}>
                  <a href="" target="_blank" className="text-decoration-none">
                    Github
                  </a>
                </Col>
                <Col xs={4}>
                  <a href="" target="_blank" className="text-decoration-none">
                    About
                  </a>
                </Col>
                <Col xs={4}>
                  <a href="#" className="text-decoration-none">
                    Support
                  </a>
                </Col>
              </Row>
            </div>
          </div>
          <Container className="px-0" fluid>
            <div className="bg-dark d-flex justify-content-between align-items-center px-3">
              <div className="d-flex flex-column align-items-start">
                <h3 className="mb-0">Dashboard</h3>
                <p className="mb-0">Home / Dashboard</p>
              </div>
              <div className="d-flex">
                <Dropdown data-bs-theme="dark">
                  <Dropdown.Toggle variant="dark" className="bg-transparent border-0 p-0 d-flex align-items-center">
                    <Image
                      src={profileUrl ?? "/assets/images/ppls-logo.png"}
                      alt="Profile"
                      width={40}
                      height={40}
                      roundedCircle
                    />
                    <span className="d-lg-none ms-2 me-1 mt-1 fs-5 fw-semibold">Profile</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" className="position-absolute mt-2">
                    <Dropdown.Item disabled className="fw-bold text-light">
                      {user?.user_metadata?.username ?? user?.email}
                    </Dropdown.Item>
                    {isAdmin && (
                      <>
                        <Dropdown.Item href="/drivershub/dashboard">Dashboard</Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="content-wrapper">
              <h2>Dashboard</h2>
              {/* <Card className="w-100 bg-dark rounded-0 border-0 shadow">
              <CardBody className="p-4">
                <CardTitle className="text-uppercase fs-2 text-light mb-3">user jobs</CardTitle>
                <TableJobs />
              </CardBody>
            </Card> */}
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}

