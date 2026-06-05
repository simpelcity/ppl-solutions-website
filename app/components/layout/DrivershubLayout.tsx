"use client";

import { Container, Breadcrumb } from "react-bootstrap";
import { Sidebar } from "@/components";
import { useSidebar } from "@/lib";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/drivershub/layout/DrivershubLayout.scss"
import "@/styles/drivershub/DrivershubGlobals.scss"
import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode;
  isNavbarVisible?: boolean;
  dict: Dictionary;
  lang: Locale;
}

export default function DrivershubLayout({ children, isNavbarVisible = false, dict, lang }: Props) {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobile } = useSidebar();

  const dashboardWidth = isSidebarCollapsed ? "dashboard-expanded" : "dashboard-collapsed";

  const pathname = usePathname();
  const split = pathname.slice(1).split("/");
  const isLast = split[split.length - 1];
  console.log("split:", split, "isLast:", isLast);

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
        <Breadcrumb className="bg-surface-lighter p-3">
          {split[1] && <Breadcrumb.Item className="fs-5 fw-semibold" href={`/${split[0]}/${split[1]}`} active={split.length === 2}>{dict.drivershub.breadcrumbs[split[1] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}
          
          {(split[2] && !split[3]) && <Breadcrumb.Item className="fs-5 fw-semibold" active>{dict.drivershub.breadcrumbs[split[2] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}

          {(split[3] && split[2] !== 'profile') && <Breadcrumb.Item className="fs-5 fw-semibold" href={`/${split[0]}/${split[1]}/${split[2]}`}>{dict.drivershub.breadcrumbs[split[2] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}

          {(split[3] && split[2] === 'profile' && isLast === "settings") && <Breadcrumb.Item className="fs-5 fw-semibold" href={`/${split[0]}/${split[1]}/${split[2]}/${split[3]}`}>{dict.drivershub.breadcrumbs[split[2] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}

          {(split[3] && split[2] === 'profile' && !split[4]) && <Breadcrumb.Item className="fs-5 fw-semibold" href={`/${split[0]}/${split[1]}/${split[2]}/${split[3]}`} active>{dict.drivershub.breadcrumbs[split[2] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}

          {(split[3] && !split[4] && split[2] !== 'profile') && <Breadcrumb.Item className="fs-5 fw-semibold" active>{dict.drivershub.breadcrumbs[split[3] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}

          {(split[3] && split[4] && split[2] === 'profile') && <Breadcrumb.Item className="fs-5 fw-semibold" href={`/${split[0]}/${split[1]}/${split[2]}/${split[3]}`} active>{dict.drivershub.breadcrumbs[split[4] as keyof typeof dict.drivershub.breadcrumbs]}</Breadcrumb.Item>}
        </Breadcrumb>
        <div className="content-wrapper flex-grow-1 d-flex flex-column p-0 m-0">
          {children}
        </div>
      </Container>
    </Container>
  );
}

