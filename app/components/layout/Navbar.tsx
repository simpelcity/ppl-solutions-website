"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavButtons } from "@/components/";
import { Navbar as BSNavbar, Nav, Container, Image, Offcanvas } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSidebar } from "@/lib/";
import { i18n } from "@/i18n";
import type { Dictionary } from "@/app/i18n";
import "@/styles/Navbar.scss";

interface NavbarProps {
  dict: Dictionary;
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

const Navbar: React.FC<NavbarProps> = ({ dict }) => {
  const width = useWindowWidth();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const { toggleSidebar, isMobile } = useSidebar();
  const isDrivershub = pathname?.startsWith("/drivershub");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const currentLocale = i18n.locales.find(
    (locale) => pathname?.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || i18n.defaultLocale;

  useEffect(() => {
    setExpanded(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const offCanvas = width > 992 && width < 1080;
  const mobile = width < 992;

  const navLinks = [
    { title: dict.navbar.navigation.home, href: currentLocale === i18n.defaultLocale ? "/" : `/${currentLocale}` },
    { title: dict.navbar.navigation.events, href: currentLocale === i18n.defaultLocale ? "/events" : `/${currentLocale}/events` },
    { title: dict.navbar.navigation.team, href: currentLocale === i18n.defaultLocale ? "/team" : `/${currentLocale}/team` },
    { title: dict.navbar.navigation.gallery, href: currentLocale === i18n.defaultLocale ? "/gallery" : `/${currentLocale}/gallery` },
    { title: dict.navbar.navigation.contact, href: currentLocale === i18n.defaultLocale ? "/contact" : `/${currentLocale}/contact` },
  ];

  return (
    <header>
      <BSNavbar expanded={expanded} onToggle={(next) => setExpanded(next)} expand="lg" bg="dark" variant="dark">
        <Container className="m-0 p-0 d-flex align-items-center" fluid>
          {isDrivershub && isMobile && (
            <button
              className="btn btn-link text-light border-0 ms-1"
              style={{ padding: "0 0.75rem" }}
              onClick={toggleSidebar}>
              <RxHamburgerMenu size={30} />
            </button>
          )}
          <BSNavbar.Brand
            as={Link}
            onClick={() => setExpanded(false)}
            href="/"
            className="d-flex align-items-center mx-0 ms-3 me-lg-0 column-gap-2">
            <Image src="/assets/images/ppls-logo.png" alt="PPLS Logo" width={50} height={50} roundedCircle />
            <h5 className="my-auto">{dict.navbar.brand}</h5>
          </BSNavbar.Brand>
          <BSNavbar.Toggle className="me-1" aria-controls="main-navbar" />
          <BSNavbar.Collapse className="pb-3 pt-2 py-lg-0 px-3 px-lg-0 me-lg-3" id="main-navbar">
            <Nav className="mx-auto d-flex justify-content-center mb-3 mb-lg-0 row-gap-1">
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.href}
                  as={Link}
                  onClick={() => setExpanded(false)}
                  href={link.href}
                  className={`${pathname === link.href ? "active" : ""
                    } text-light fs-5 px-xl-0 pt-xl-0 text-center mx-xl-2`}>
                  {link.title}
                </Nav.Link>
              ))}
            </Nav>
            <hr className="text-light" />
            {offCanvas ? (
              <>
                <button onClick={handleShow} className="btn btn-link text-light border-0">
                  <RxHamburgerMenu size={30} />
                </button>

                <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark text-white">
                  <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>{dict.navbar.navigation.title}</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <NavButtons dict={dict} width={width} />
                  </Offcanvas.Body>
                </Offcanvas>
              </>
            ) : mobile ? (
              <NavButtons dict={dict} width={width} />
            ) : (
              <NavButtons dict={dict} width={width} />
            )}
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </header>
  );
};

export default Navbar;

