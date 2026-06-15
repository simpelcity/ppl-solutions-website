"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from 'next-themes'
import { NavButtons, BSLink } from "@/components";
import { Navbar as BSNavbar, Nav, Container, Image, Offcanvas } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoSidebarExpand } from "react-icons/go";
import { useSidebar } from "@/lib";
import type { Dictionary } from "@/app/i18n";
import { type Locale } from "@/i18n"
import "@/styles/layout/Navbar.scss";

interface NavbarProps {
  dict: Dictionary;
  lang: Locale;
}

function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

const Navbar: React.FC<NavbarProps> = ({ dict, lang }) => {
  const [width, setWidth] = useState(0);
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const { toggleSidebar, isMobile, setShowOffcanvas } = useSidebar();
  const [show, setShow] = useState(false);
  const [showOffcanvasNavbar, setShowOffcanvasNavbar] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const currentLocale = lang === "en" ? "" : `/${lang}`;
  const { resolvedTheme } = useTheme();

  const isDrivershub = pathname.startsWith(`${currentLocale}/drivershub`);

  useEffect(() => {
    setExpanded(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    }
  }, []);

  const handleShowOffcanvasNavbar = () => setShowOffcanvasNavbar(true);
  const handleCloseOffcanvasNavbar = () => setShowOffcanvasNavbar(false);

  const offCanvas = width >= 992 && width <= 1150;
  const isTablet = width >= 576 && width <= 1150;

  const navLinks = [
    { title: dict.navbar.navigation.home, href: `${lang === 'en' ? '/' : currentLocale}` },
    { title: dict.navbar.navigation.events, href: `${currentLocale}/events` },
    { title: dict.navbar.navigation.team, href: `${currentLocale}/team` },
    { title: dict.navbar.navigation.gallery, href: `${currentLocale}/gallery` },
    { title: dict.navbar.navigation.contact, href: `${currentLocale}/contact` },
  ];

  const brandSplit = dict.navbar.brand.split(" ");
  const brand1 = brandSplit[0] + (brandSplit.length > 1 ? " " : "") + (brandSplit.length > 1 ? brandSplit[1] : "");
  const brand2 = brandSplit[2];

  return (
    <header className="position-sticky top-0" style={{ zIndex: 5 }}>
      <BSNavbar expanded={expanded} onToggle={(next) => setExpanded(next)} expand="md" bg={resolvedTheme} variant={resolvedTheme}  className={`${isMobile && isDrivershub ? 'ps-1' : 'ps-3'} pe-1 px-lg-3`}>
        <Container className="m-0 p-0 d-flex align-items-center" fluid>
          {isMobile && isDrivershub && (
            <button
              className="btn btn-link text-theme text-opacity-75 border-0"
              style={{ padding: "0.25rem 0.75rem" }}
              onClick={() => setShowOffcanvas(true)}>
              <GoSidebarExpand className="flip" size={30} />
            </button>
          )}

          <BSNavbar.Brand
            as={Link}
            onClick={() => setExpanded(false)}
            href={`${lang === 'en' ? '/' : currentLocale}`}
            className="d-flex align-items-center mx-0 column-gap-2">
              {width > 768 && (
              <Image src={`/assets/images/${resolvedTheme}/logo.png`} alt={dict.navbar.alt} width={50} height={50} roundedCircle />
              )}

              {isDrivershub ? (
                <span className="my-auto">
                  <span className={`font-freestyle fw-normal ${isMobile ? 'fs-1' : 'fs-2'}`}>{brand1}</span>{" "}
                  <span className={`font-freestyle fw-normal ${isMobile ? 'fs-1' : 'fs-2'}`}>{brand2}</span>
                </span>
              ) : (
                <span className="my-auto">
                  <span className={`font-freestyle fw-normal ${isMobile ? 'fs-1' : 'fs-2'}`}>{brand1}</span>{" "}
                  <span className={`font-freestyle fw-normal ${isMobile ? 'fs-1' : 'fs-2'}`}>{brand2}</span>
                </span>
              )}
          </BSNavbar.Brand>

          {width < 576 && (
            <BSNavbar.Toggle aria-controls="main-navbar" className="text-theme text-opacity-75 border-0 shadow-none">
              {expanded ? <RxHamburgerMenu className="" size={30} /> : <RxHamburgerMenu className="" size={30} />}
            </BSNavbar.Toggle>
          )}

          {isDrivershub ? (
            <>
              {isTablet && !offCanvas ? (
                <>
                  <button onClick={handleShow} className="btn btn-link text-theme border-0">
                    <RxHamburgerMenu size={30} />
                  </button>

                  <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-surface text-theme">
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>{dict.navbar.navigation.title}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="mx-auto d-flex justify-content-center mb-3 mb-md-0 row-gap-1 column-gap-md-3 drivershub-nav">
                        {navLinks.map((link) => (
                          <BSLink
                            key={link.href}
                            variant="nav"
                            href={link.href}
                            state={(link.href === `${currentLocale}/events` && pathname.startsWith(`${currentLocale}/events`)) || pathname === link.href ? 'active' : undefined}
                            classes=""
                            onClick={() => setExpanded(false)}
                          >
                            <span>{link.title}</span>
                          </BSLink>
                        ))}
                      </Nav>

                      <hr className="text-theme" />

                      <NavButtons dict={dict} width={width} isMobile={isMobile} />
                    </Offcanvas.Body>
                  </Offcanvas>
                </>
              ) : (
                <BSNavbar.Collapse className="p-3 p-md-0" id="main-navbar">
                  <Nav className="mx-auto d-flex justify-content-center mb-3 mb-md-0 row-gap-1 column-gap-md-3 column-gap-xl-0">
                    {navLinks.map((link) => (
                      <BSLink
                        key={link.href}
                        variant="nav"
                        href={link.href}
                        state={(link.href === `${currentLocale}/events` && pathname.startsWith(`${currentLocale}/events`)) || pathname === link.href ? 'active' : undefined}
                        classes=""
                        onClick={() => setExpanded(false)}
                      >
                        <span>{link.title}</span>
                      </BSLink>
                    ))}
                  </Nav>

                  <hr className="text-theme" />

                  {offCanvas || isTablet ? (
                    <>
                      <button onClick={handleShow} className="btn btn-link text-theme border-0">
                        <RxHamburgerMenu size={30} />
                      </button>

                      <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-surface text-theme">
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title>{dict.navbar.buttons.title}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <NavButtons dict={dict} width={width} isMobile={isMobile} />
                        </Offcanvas.Body>
                      </Offcanvas>
                    </>
                  ) : (
                    <NavButtons dict={dict} width={width} isMobile={isMobile} />
                  )}
                </BSNavbar.Collapse>
              )}
            </>
          ) : (
            <>
              {isTablet && !offCanvas ? (
                <>
                  <button onClick={handleShow} className="btn btn-link text-theme border-0">
                    <RxHamburgerMenu size={30} />
                  </button>

                  <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-surface text-theme">
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>{dict.navbar.navigation.title}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="mx-auto d-flex justify-content-center mb-3 mb-md-0 row-gap-1 column-gap-md-3 drivershub-nav">
                        {navLinks.map((link) => (
                          <BSLink
                            key={link.href}
                            variant="nav"
                            href={link.href}
                            state={(link.href === `${currentLocale}/events` && pathname.startsWith(`${currentLocale}/events`)) || pathname === link.href ? 'active' : undefined}
                            classes=""
                            onClick={() => setExpanded(false)}
                          >
                            <span>{link.title}</span>
                          </BSLink>
                        ))}
                      </Nav>

                      <hr className="text-theme" />

                      <NavButtons dict={dict} width={width} isMobile={isMobile} />
                    </Offcanvas.Body>
                  </Offcanvas>
                </>
              ) : (
                <BSNavbar.Collapse className="p-3 p-md-0" id="main-navbar">
                  <Nav className="mx-auto d-flex justify-content-center mb-3 mb-md-0 row-gap-1 column-gap-md-3 column-gap-xl-0">
                    {navLinks.map((link) => (
                      <BSLink
                        key={link.href}
                        variant="nav"
                        href={link.href}
                        state={(link.href === `${currentLocale}/events` && pathname.startsWith(`${currentLocale}/events`)) || pathname === link.href ? 'active' : undefined}
                        classes=""
                        onClick={() => setExpanded(false)}
                      >
                        <span>{link.title}</span>
                      </BSLink>
                    ))}
                  </Nav>

                  <hr className="text-theme" />

                  {offCanvas || isTablet ? (
                    <>
                      <button onClick={handleShow} className="btn btn-link text-theme border-0">
                        <RxHamburgerMenu size={30} />
                      </button>

                      <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-surface text-theme">
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title>{dict.navbar.buttons.title}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <NavButtons dict={dict} width={width} isMobile={isMobile} />
                        </Offcanvas.Body>
                      </Offcanvas>
                    </>
                  ) : (
                    <NavButtons dict={dict} width={width} isMobile={isMobile} />
                  )}
                </BSNavbar.Collapse>
              )}
            </>
          )}
        </Container>
      </BSNavbar>
    </header>
  );
};

export default Navbar;

