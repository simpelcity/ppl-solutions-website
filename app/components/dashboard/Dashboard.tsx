"use client";

import { Container } from "react-bootstrap";
import { Sidebar } from "@/components";
import { useSidebar } from "@/lib";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/Dashboard.scss";

interface DashboardProps {
  children: React.ReactNode;
  isNavbarVisible?: boolean;
  dict: Dictionary;
  lang: Locale;
}

export default function Dashboard({ children, isNavbarVisible = false, dict, lang }: DashboardProps) {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobile } = useSidebar();

  const dashboardWidth = isSidebarCollapsed ? "dashboard-expanded" : "dashboard-collapsed";

  return (
    <Container className="d-flex p-0 m-0" fluid>
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
        isNavbarVisible={true}
        dict={dict}
        lang={lang}
      />
      <Container
        className={`content-footer-wrapper d-flex flex-column p-0 m-0 ${isMobile ? "vw-100" : dashboardWidth}`}
        style={{
          // width: isMobile ? "100vw" : `calc(100% - ${sidebarWidth})`,
          transition: "width 0.3s ease, margin-top 0.3s ease",
          // overflowX: "hidden",
        }}
        fluid
      >
        {children}
      </Container>
    </Container>
  );
}

