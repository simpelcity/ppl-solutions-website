"use client"

import { Container } from "react-bootstrap"
import { Sidebar } from "@/components"
import { useSidebar } from "@/lib/SidebarContext"

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
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobile } = useSidebar()

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
        isNavbarVisible={true}
      />
      <Container
        className="content-wrapper d-flex justify-content-center px-3"
        style={{
          width: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth})`,
          maxWidth: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth})`,
          transition: "width 0.3s ease, margin-top 0.3s ease",
          overflowX: "hidden",
        }}
        fluid>
        {children}
      </Container>
    </div>
  )
}

