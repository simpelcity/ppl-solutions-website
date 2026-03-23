"use client";

import { Container } from "react-bootstrap";
import { Sidebar } from "@/components";
import { useSidebar } from "@/lib";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

interface DashboardProps {
  children: React.ReactNode;
  isNavbarVisible?: boolean;
  dict: Dictionary;
  lang: Locale;
}

export default function Dashboard({ children, isNavbarVisible = false, dict, lang, ...props }: DashboardProps) {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobile, isTablet } = useSidebar();

  const sidebarWidth = isSidebarCollapsed ? "4.5rem" : "280px";

  return (
    <div
      className={`d-flex flex-column flex-md-row overflow-x-hidden`}
      style={{ position: "relative", width: "100vw", maxWidth: "100vw" }}>
      <Sidebar
        id="sidebar"
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
        isTablet={isTablet}
        isNavbarVisible={true}
        dict={dict}
        lang={lang}
      />
      <Container
        className="content-wrapper d-flex justify-content-center px-3 mx-0"
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
  );
}

