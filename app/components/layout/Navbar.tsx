"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavButtons } from "@/components";
import { Navbar as BSNavbar, Nav, Container, Image, Offcanvas } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { useSidebar } from "@/lib";
import { i18n } from "@/i18n";
import type { Dictionary } from "@/app/i18n";
import { type Locale } from "@/i18n"
import "@/styles/Navbar.scss";

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
  const { toggleSidebar, isMobile } = useSidebar();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const currentLocale = lang === "en" ? "" : `/${lang}`;

  const isDrivershub = pathname.startsWith(`${currentLocale}/drivershub`);
  // console.log(isMobile, isDrivershub)

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

  const offCanvas = width >= 992 && width <= 1150;

  const navLinks = [
    { title: dict.navbar.navigation.home, href: `${currentLocale}` },
    { title: dict.navbar.navigation.events, href: `${currentLocale}/events` },
    { title: dict.navbar.navigation.team, href: `${currentLocale}/team` },
    { title: dict.navbar.navigation.gallery, href: `${currentLocale}/gallery` },
    { title: dict.navbar.navigation.contact, href: `${currentLocale}/contact` },
  ];

  return (
    <header className="position-sticky top-0" style={{ zIndex: 5 }}>
      <BSNavbar expanded={expanded} onToggle={(next) => setExpanded(next)} expand="lg" bg="dark" variant="dark" className="px-lg-3">
        <Container className="m-0 p-0 d-flex align-items-center" fluid>
          {isMobile && isDrivershub && (
            <button
              className="btn btn-link text-light text-opacity-75 border-0 ms-1"
              style={{ padding: "0.25rem 0.75rem" }}
              onClick={toggleSidebar}>
              <RxHamburgerMenu size={30} />
            </button>
          )}
          <BSNavbar.Brand
            as={Link}
            onClick={() => setExpanded(false)}
            href={currentLocale}
            className="d-flex align-items-center mx-0 column-gap-2">
            <Image src="/assets/images/ppls-logo.png" alt="PPLS Logo" width={50} height={50} roundedCircle />
            <h5 className="my-auto">{dict.navbar.brand}</h5>
          </BSNavbar.Brand>
          <BSNavbar.Toggle className="me-1" aria-controls="main-navbar" />
          <BSNavbar.Collapse className="p-3 p-lg-0" id="main-navbar">
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

