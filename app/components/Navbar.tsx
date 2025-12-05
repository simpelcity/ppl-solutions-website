"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Navbar as BSNavbar, Nav, Container, Image, Dropdown } from "react-bootstrap"
import { useAuth } from "@/lib/AuthContext"
import { ButtonSecondary } from "@/components"
import "@/styles/Navbar.scss"

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [pathname])

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Events", href: "/events" },
    { title: "Team", href: "/team" },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
  ]

  return (
    <header>
      <BSNavbar expanded={expanded} onToggle={(next) => setExpanded(next)} expand="lg" bg="dark" variant="dark">
        <Container className="m-0 p-0" fluid>
          <BSNavbar.Brand
            as={Link}
            onClick={() => setExpanded(false)}
            href="/"
            className="d-flex align-items-center ms-3 me-0 column-gap-2">
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
                  className={`${
                    pathname === link.href ? "active" : ""
                  } text-light fs-5 py-3 p-xl-0 text-center mx-xl-2`}>
                  {link.title}
                </Nav.Link>
              ))}
            </Nav>
            <Nav className="d-flex align-items-lg-center justify-content-center flex-row nav-buttons column-gap-2">
              <ButtonSecondary href="/apply" classes="w-100" onClick={() => setExpanded(false)}>
                Apply
              </ButtonSecondary>
              <ButtonSecondary href="/drivershub" classes="w-100" onClick={() => setExpanded(false)}>
                Drivershub
              </ButtonSecondary>
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </header>
  )
}

export default Navbar

