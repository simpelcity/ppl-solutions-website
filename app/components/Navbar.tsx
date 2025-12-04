"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Navbar as RBNavbar, Nav, Container, Button, Image } from "react-bootstrap"
import { useAuth } from "@/lib/AuthContext"
import { ButtonSecondary } from "@/components"
import "@/styles/Navbar.scss"

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const showAuth = Boolean(user && pathname && pathname.startsWith("/drivershub"))
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    setExpanded(false)
  }, [pathname])

  const handleLogout = async () => {
    if (!logout) return
    await logout()
    router.push("/")
  }

  // Define nav links
  const navLinks: { title: string; href: string }[] = [
    { title: "Home", href: "/" },
    { title: "Events", href: "/events" },
    { title: "Team", href: "/team" },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
  ]

  return (
    <RBNavbar
      expanded={expanded}
      onToggle={(next) => setExpanded(next)}
      expand="lg"
      bg="dark"
      variant="dark"
      className="shadow-sm">
      <Container className="px-3" fluid>
        <RBNavbar.Brand
          as={Link}
          onClick={() => setExpanded(false)}
          href="/"
          className="d-flex align-items-center m-0 column-gap-2">
          <Image src={"/assets/images/ppls-logo.png"} alt="PPLS Logo" width={50} height={50} roundedCircle />
          <h5 className="my-auto">PPL Solutions VTC</h5>
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="main-navbar" />
        <RBNavbar.Collapse className="my-2 my-xl-0" id="main-navbar">
          <Nav className="w-100 d-flex justify-content-center mb-3 mb-xl-0 row-gap-1">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.href}
                as={Link}
                onClick={() => setExpanded(false)}
                href={link.href}
                className={`${pathname === link.href ? "active" : ""} text-light fs-5 py-3 p-xl-0 text-center mx-xl-2`}>
                {link.title}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="d-flex align-items-lg-center flex-row nav-buttons column-gap-2">
            {!loading &&
              (showAuth ? (
                <>
                  <Nav.Item className="me-2 d-flex align-items-center">
                    <span className="nav-link">{(user as any)?.user_metadata?.username ?? user?.email}</span>
                  </Nav.Item>
                  <Nav.Item>
                    <Button variant="link" className="nav-link p-0" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <ButtonSecondary href="/apply" onClick={() => setExpanded(false)}>
                    Apply
                  </ButtonSecondary>
                  <ButtonSecondary href="/drivershub" onClick={() => setExpanded(false)}>
                    Drivershub
                  </ButtonSecondary>
                </>
              ))}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  )
}

export default Navbar

