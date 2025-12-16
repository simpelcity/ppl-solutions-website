"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Container, Dropdown, Row, Col, Image, Spinner, ListGroup, Collapse, Nav } from "react-bootstrap"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import Sidebar from "./Sidebar"

interface TeamMember {
  name: string
  profile_url: string | null
  admin: boolean | null
}

interface DashboardProps {
  children: React.ReactNode
  isNavbarVisible?: boolean
}

export default function Dashboard({ children, isNavbarVisible = false, ...props }: DashboardProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 992
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const sidebarWidth = isSidebarCollapsed ? "4.5rem" : "280px"

  return (
    <div
      className={`d-flex ${isMobile ? "flex-column" : "flex-row"} overflow-x-hidden`}
      style={{ position: "relative", width: "100vw", maxWidth: "100vw" }}>
      <Sidebar
        id="sidebar"
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
        isNavbarVisible={isNavbarVisible}
      />
      <Container
        className="content-wrapper d-flex justify-content-center px-3"
        style={{
          width: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth})`,
          maxWidth: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth})`,
          transition: "width 0.3s ease",
          overflowX: "hidden",
        }}
        fluid>
        {children}
      </Container>
    </div>
  )
}

