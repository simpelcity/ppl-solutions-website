"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib";
import { Dropdown, Image, Nav, Collapse, Offcanvas } from "react-bootstrap";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { MdLeaderboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { GoArrowSwitch } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { MdPhotoLibrary } from "react-icons/md";
import { LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useGallery } from '@/hooks/useGallery'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useProfile } from '@/hooks/useProfile'
import { useTeam } from '@/hooks/useTeam'
import { useUserJobs } from "@/hooks/useUserJobs";
import { useUserStats } from '@/hooks/useUserStats'
import { useVtcStats } from '@/hooks/useVtcStats'

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  isMobile: boolean;
  isTablet: boolean;
  isNavbarVisible?: boolean;
  dict: Dictionary;
  lang: Locale;
  [key: string]: any;
}

function SidebarContent({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobile,
  isTablet,
  isNavbarVisible = false,
  dict,
  lang,
  ...props
}: SidebarProps) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const { user, logout, session, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const currentLang = lang === 'en' ? '' : `/${lang}`

  const navItems: NavItem[] = [
    {
      href: `${currentLang}/drivershub`,
      icon: <GoHomeFill />,
      label: dict.drivershub.sidebar.drivershub || "Drivershub",
    },
    {
      href: `${currentLang}/drivershub/statistics`,
      icon: <FaChartLine />,
      label: dict.drivershub.sidebar.userStats || "User Statistics",
    },
    {
      href: `${currentLang}/drivershub/leaderboard`,
      icon: <MdLeaderboard />,
      label: dict.drivershub.sidebar.leaderboard || "Leaderboard",
    },
  ];

  const collapseItems: NavItem[] = [
    {
      href: `${currentLang}/drivershub/dashboard`,
      icon: <FaChartLine />,
      label: dict.drivershub.sidebar.dashboard.vtcStats || "VTC Statistics",
    },
    {
      href: `${currentLang}/drivershub/dashboard/team`,
      icon: <FaUsers />,
      label: dict.drivershub.sidebar.dashboard.team || "Team",
    },
    {
      href: `${currentLang}/drivershub/dashboard/gallery`,
      icon: <MdPhotoLibrary />,
      label: dict.drivershub.sidebar.dashboard.gallery || "Gallery",
    },
  ];

  useEffect(() => {
    const fetchProfileAndRole = async () => {
      if (!user?.user_metadata?.username) return;

      try {
        const res = await fetch("/api/team");
        if (!res.ok) return;

        const json = await res.json();
        const payload = json.data ?? [];

        let members: { name: string; profile_url?: string | null }[] = [];

        if (Array.isArray(payload) && payload.length > 0) {
          if (payload[0].team_member) {
            members = payload.map((item: any) => {
              const tm = item.team_member ?? {};
              return { name: tm.name, profile_url: tm.profile_url ?? null };
            });
          } else {
            members = payload.map((m: any) => ({
              name: m.name,
              profile_url: m.profile_url ?? null,
            }));
          }
        }

        const member = members.find((m) => m.name === user.user_metadata?.username);

      } catch (err) {
        console.error("Failed to fetch team profile:", err);
      }
    };

    const fetchProfilePicture = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/profile-picture?id=${encodeURIComponent(user.id)}`);
        if (!res.ok) return;

        const json = await res.json();
        setProfileUrl(json.profile?.profile_url ?? null);
        return json.profile?.profile_url ?? null;
      } catch (err) {
        console.error("Failed to fetch profile picture:", err);
      }
    }

    fetchProfileAndRole();
    fetchProfilePicture();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [user, pathname]);

  const handleLogout = async () => {
    if (!logout) return;
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (!loading && !session) router.push("/login");
  }, [session, loading]);

  useEffect(() => {
    if (pathname.startsWith(`${currentLang}/drivershub/dashboard`)) {
      if (isAdmin === false) {
        router.push(`${currentLang}/drivershub`);
      }
    }
  }, [isAdmin, pathname, currentLang]);

  if (loading) return <LoaderSpinner dict={dict} />
  if (!session) return null;
  if (!user) return null;

  const username = user.user_metadata.display_name || user.email;

  return (
    <>
      <Nav variant="pills" className="flex-column mb-auto">
        {navItems.map((item) => (
          <Nav.Item key={item.href}>
            <Nav.Link
              href={item.href}
              className={`text-light d-flex align-items-center ${isSidebarCollapsed ? "justify-content-center p-3 rounded-0" : ""
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
                className={`d-flex align-items-center justify-content-between rounded-bottom-0 text-light ${pathname.startsWith(`${currentLang}/drivershub/dashboard`) ? "active" : ""
                  }`}>
                <div className="d-flex">
                  <span className="me-2"><BiSolidDashboard /></span>
                  Dashboard
                </div>
                {open ? <FaAngleRight className="rotate-90-cw" /> : <FaAngleDown className="rotate-90-ccw" />}
              </Nav.Link>
              <Collapse in={open}>
                <div id="dashboard-collapse-menu">
                  <ul className="list-unstyled m-0">
                    {collapseItems.map((item, index) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`text-decoration-none text-light d-flex align-items-center px-4 py-2 ${pathname === item.href ? "bg-light bg-opacity-10" : ""
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
                  className={`text-light d-flex align-items-center justify-content-center p-3 rounded-0 ${pathname === item.href ? "active" : ""
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
            <Dropdown.Item href={`/drivershub/profile/${session.user.id}/settings`}>{dict.drivershub.sidebar.profile.settings || "Settings"}</Dropdown.Item>
            <Dropdown.Item href={`/drivershub/profile/${session.user.id}`}>{dict.drivershub.sidebar.profile.profile || "Profile"}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>{dict.drivershub.sidebar.profile.logout || "Sign out"}</Dropdown.Item>
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
            <Dropdown.Item href="/drivershub/profile/settings">{dict.drivershub.sidebar.profile.settings || "Settings"}</Dropdown.Item>
            <Dropdown.Item href="/drivershub/profile">{dict.drivershub.sidebar.profile.profile || "Profile"}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>{dict.drivershub.sidebar.profile.logout || "Sign out"}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  )
}

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobile,
  isTablet,
  isNavbarVisible = false,
  dict,
  lang,
  ...props
}: SidebarProps) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    if (isMobile && !isSidebarCollapsed) setShowOffcanvas(true);
    else setShowOffcanvas(false);
  }, [isMobile, isSidebarCollapsed]);

  return isMobile ? (
    <Offcanvas
      show={showOffcanvas}
      onHide={() => setShowOffcanvas(false)}
      placement="start"
      scroll={true}
      backdrop={false}
      className="sidebar bg-light-subtle"
      data-bs-theme="dark"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{dict.drivershub.sidebar.title || "Sidebar"}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        <SidebarContent
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isMobile={isMobile}
          isTablet={isTablet}
          isNavbarVisible={isNavbarVisible}
          dict={dict}
          lang={lang}
        />
      </Offcanvas.Body>
    </Offcanvas>
  ) : (
    <div
      id="sidebar"
      className="sidebar d-flex flex-column flex-shrink-0 text-light bg-light-subtle text-start"
      style={{
        height: "calc(100dvh - 76px)",
        width: isSidebarCollapsed ? "4.5rem" : "260px",
        // maxWidth: isSidebarCollapsed ? "4.5rem" : "260px",
        position: "var(--sidebar-position, relative)" as any,
        top: isNavbarVisible ? 0 : "auto",
        left: isMobile ? 0 : "auto",
        zIndex: 999,
        transform: isMobile && isSidebarCollapsed ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.3s ease, width 0.3s ease",
        overflow: isSidebarCollapsed && !isMobile ? "visible" : "hidden",
        padding: isSidebarCollapsed && !isMobile ? "1rem 0" : "1rem",
      }}
      {...props}>
      <div
        className={`sidebar-header d-flex align-items-center text-light text-decoration-none ${isSidebarCollapsed ? "justify-content-center pb-3" : "justify-content-between"
          }`}>
        <a href="#" className="text-light text-decoration-none column-gap-2">
          <h3 className="m-0" style={{ display: isSidebarCollapsed ? "none" : "block" }}>
            {dict.drivershub.sidebar.title || "Sidebar"}
          </h3>
        </a>
        <GoArrowSwitch className="fs-3" role="button" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>
      <hr className={isSidebarCollapsed ? "d-none" : "d-block"} />

      <SidebarContent
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
        isTablet={isTablet}
        isNavbarVisible={isNavbarVisible}
        dict={dict}
        lang={lang}
      // ...other props
      />
    </div>
  );
}