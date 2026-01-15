"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BSButton } from "@/components/";
import { Navbar as BSNavbar, Nav, Container, Image } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSidebar } from "@/lib/";
import "@/styles/Navbar.scss";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const { toggleSidebar, isMobile } = useSidebar();
  const isDrivershub = pathname?.startsWith("/drivershub");

  useEffect(() => {
    setExpanded(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Events", href: "/events" },
    { title: "Team", href: "/team" },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header>
      <BSNavbar expanded={expanded} onToggle={(next) => setExpanded(next)} expand="lg" bg="dark" variant="dark">
        <Container className="m-0 p-0 d-flex align-items-center" fluid>
          {isDrivershub && isMobile && (
            <button
              className="btn btn-link text-light border-0 ms-1"
              style={{ padding: "0 0.75rem", fontSize: "30px" }}
              onClick={toggleSidebar}>
              <RxHamburgerMenu />
            </button>
          )}
          <BSNavbar.Brand
            as={Link}
            onClick={() => setExpanded(false)}
            href="/"
            className="d-flex align-items-center mx-0 ms-xl-3 me-xl-0 column-gap-2">
            <Image src="/assets/images/ppls-logo.png" alt="PPLS Logo" width={50} height={50} roundedCircle />
            <h5 className="my-auto">PPL Solutions VTC</h5>
          </BSNavbar.Brand>
          <BSNavbar.Toggle className="me-1" aria-controls="main-navbar" />
          <BSNavbar.Collapse className="pb-3 pt-2 py-xl-0 px-3 px-xl-0 me-xl-3" id="main-navbar">
            <Nav className="w-100 d-flex justify-content-center mb-3 mb-xl-0 row-gap-1">
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
            <Nav className="d-flex align-items-lg-center justify-content-center flex-row nav-buttons column-gap-2">
              <BSButton
                variant="secondary"
                border="primary 2"
                href="/apply"
                classes="w-100"
                onClick={() => setExpanded(false)}>
                Apply
              </BSButton>
              <BSButton
                variant="secondary"
                border="primary 2"
                href="/login"
                classes="w-100"
                onClick={() => setExpanded(false)}>
                Drivershub
              </BSButton>
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </header>
  );
};

export default Navbar;

