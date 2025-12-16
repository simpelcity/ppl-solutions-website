"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Dropdown, Image, Nav, Collapse, Spinner } from "react-bootstrap"
import { FaAngleLeft, FaAngleRight, FaAngleDown } from "react-icons/fa6"
import { GoHomeFill } from "react-icons/go"
import { MdLeaderboard } from "react-icons/md"
import { FaChartLine } from "react-icons/fa6"
import { BiSolidDashboard } from "react-icons/bi"
import { GoArrowSwitch } from "react-icons/go"
import { FaUsers } from "react-icons/fa"
import { MdPhotoLibrary } from "react-icons/md"

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

interface SidebarProps {
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (value: boolean) => void
  isMobile: boolean
  isNavbarVisible?: boolean
  [key: string]: any
}

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobile,
  isNavbarVisible = false,
  ...props
}: SidebarProps) {
  const { user, logout, session, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [profileUrl, setProfileUrl] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      href: "/drivershub",
      icon: <GoHomeFill />,
      label: "Drivershub",
    },
    {
      href: "/drivershub/statistics",
      icon: <FaChartLine />,
      label: "User Statistics",
    },
    {
      href: "/drivershub/leaderboard",
      icon: <MdLeaderboard />,
      label: "Leaderboard",
    },
  ]

  const collapseItems: NavItem[] = [
    {
      href: "/drivershub/dashboard",
      icon: <FaChartLine />,
      label: "VTC Statistics",
    },
    {
      href: "/drivershub/dashboard/team",
      icon: <FaUsers />,
      label: "Team",
    },
    {
      href: "/drivershub/dashboard/gallery",
      icon: <MdPhotoLibrary />,
      label: "Gallery",
    },
  ]

  useEffect(() => {
    const fetchProfileAndRole = async () => {
      if (!user?.user_metadata?.username) return

      try {
        const res = await fetch("/api/team")
        if (!res.ok) return

        const json = await res.json()
        const payload = json.data ?? []

        let members: { name: string; profile_url?: string | null; admin?: boolean | string | null }[] = []

        if (Array.isArray(payload) && payload.length > 0) {
          if (payload[0].team_member) {
            members = payload.map((item: any) => {
              const tm = item.team_member ?? {}
              return { name: tm.name, profile_url: tm.profile_url ?? null, admin: tm.admin ?? null }
            })
          } else {
            members = payload.map((m: any) => ({
              name: m.name,
              profile_url: m.profile_url ?? null,
              admin: m.admin ?? null,
            }))
          }
        }

        const member = members.find((m) => m.name === user.user_metadata?.username)

        const adminFlag = member?.admin === true || member?.admin === "true" || Boolean(member?.admin)
        setIsAdmin(adminFlag)

        setProfileUrl(member?.profile_url ?? null)
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
    return (
      <>
        <div className="loader w-100 d-flex justify-content-center align-items-center vh-100 text-light">
          <Spinner animation="border" className="me-2" />
          <span className="fs-2">Loading...</span>
        </div>
      </>
    )
  }

  if (!session) {
    return null
  }

  const username = (session as any).user?.user_metadata?.username || session.user.email

  return (
    <div
      className="sidebar d-flex flex-column flex-shrink-0 text-light bg-light-subtle text-start"
      style={{
        width: isMobile ? "280px" : isSidebarCollapsed ? "4.5rem" : "280px",
        minWidth: isMobile ? "280px" : isSidebarCollapsed ? "4.5rem" : "280px",
        height: isMobile ? (isNavbarVisible ? "calc(100vh - 4.5rem)" : "100vh") : "100%",
        position: isMobile ? "fixed" : "relative",
        top: isMobile && isNavbarVisible ? "4.5rem" : isMobile ? 0 : "auto",
        left: isMobile ? 0 : "auto",
        zIndex: isMobile ? 1000 : 10,
        transform: isMobile && isSidebarCollapsed ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.3s ease, width 0.3s ease",
        overflow: isSidebarCollapsed && !isMobile ? "visible" : "auto",
        padding: isSidebarCollapsed && !isMobile ? "1rem 0" : "1rem",
      }}
      {...props}>
      <div
        className={`sidebar-header d-flex align-items-center text-light text-decoration-none ${
          isSidebarCollapsed ? "justify-content-center pb-3" : "justify-content-between"
        }`}>
        <a href="#" className="text-light text-decoration-none column-gap-2">
          <h3 className="m-0" style={{ display: isSidebarCollapsed ? "none" : "block" }}>
            Sidebar
          </h3>
        </a>
        {!isMobile && (
          <GoArrowSwitch className="fs-3" role="button" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        )}
      </div>
      <hr className={isSidebarCollapsed ? "d-none" : "d-block"} />
      <Nav variant="pills" className="flex-column mb-auto">
        {navItems.map((item) => (
          <Nav.Item key={item.href}>
            <Nav.Link
              href={item.href}
              className={`text-light d-flex align-items-center ${
                isSidebarCollapsed ? "justify-content-center p-3 rounded-0" : ""
              } ${pathname === item.href ? "active" : ""}`}
              title={item.label}>
              <span className={isSidebarCollapsed ? "me-0" : "me-2"}>{item.icon}</span>
              {!isSidebarCollapsed && item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
        {isAdmin && !isSidebarCollapsed && (
          <>
            <Nav.Item className={open ? "bg-light bg-opacity-10 rounded-2" : ""}>
              <Nav.Link
                onClick={() => setOpen(!open)}
                aria-controls="dashboard-collapse-menu"
                aria-expanded={open}
                className={`d-flex align-items-center column-gap-2 rounded-bottom-0 text-light ${
                  pathname.startsWith("/drivershub/dashboard") ? "active" : ""
                }`}>
                <BiSolidDashboard />
                Dashboard
                {open ? <FaAngleDown /> : <FaAngleRight />}
              </Nav.Link>
              <Collapse in={open}>
                <div id="dashboard-collapse-menu">
                  <ul className="list-unstyled m-0">
                    {collapseItems.map((item, index) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`text-decoration-none text-light d-flex align-items-center px-4 py-2 ${
                            pathname === item.href ? "bg-light bg-opacity-10" : ""
                          } ${index === collapseItems.length - 1 ? "rounded-bottom-2" : ""}`}
                          title={item.label}>
                          <span className="me-2">{item.icon}</span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Collapse>
            </Nav.Item>
          </>
        )}
        {isAdmin && isSidebarCollapsed && (
          <>
            {collapseItems.map((item) => (
              <Nav.Item key={item.href}>
                <Nav.Link
                  href={item.href}
                  className={`text-light d-flex align-items-center justify-content-center p-3 rounded-0 ${
                    pathname === item.href ? "active" : ""
                  }`}
                  title={item.label}>
                  {item.icon}
                </Nav.Link>
              </Nav.Item>
            ))}
          </>
        )}
      </Nav>
      <hr />
      {!isSidebarCollapsed && (
        <Dropdown data-bs-theme="dark">
          <Dropdown.Toggle
            variant="dark"
            className="bg-transparent border-0 p-0 d-flex align-items-center text-light text-decoration-none w-100">
            <Image
              src={profileUrl ?? "/assets/icons/profile-user.png"}
              alt="Profile"
              width={32}
              height={32}
              roundedCircle
              className="me-2"
            />
            <strong>{username}</strong>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark shadow mb-1" style={{ zIndex: 1050 }}>
            <Dropdown.Item href="/drivershub/profile/settings">Settings</Dropdown.Item>
            <Dropdown.Item href="/drivershub/profile">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {isSidebarCollapsed && (
        <Dropdown data-bs-theme="dark">
          <Dropdown.Toggle
            variant="dark"
            className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center text-light text-decoration-none w-100">
            <Image
              src={profileUrl ?? "/assets/icons/profile-user.png"}
              alt="Profile"
              width={32}
              height={32}
              roundedCircle
            />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark shadow ms-3 mb-1" style={{ zIndex: 1050 }}>
            <Dropdown.Item href="/drivershub/profile/settings">Settings</Dropdown.Item>
            <Dropdown.Item href="/drivershub/profile">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  )
}

