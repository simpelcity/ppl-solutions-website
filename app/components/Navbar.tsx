'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Navbar as RBNavbar, Nav, Container, Button, Image } from 'react-bootstrap'
import { useAuth } from '@/lib/AuthContext'
import { ButtonSecondary } from '@/components'
import '@/styles/Navbar.scss'


const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const showAuth = Boolean(user && pathname && pathname.startsWith("/drivershub"));

  const handleLogout = async () => {
    if (!logout) return;
    await logout();
    router.push('/');
  };

  // Define nav links
  const navLinks: { title: string; href: string }[] = [
    { title: 'Home', href: '/' },
    { title: 'Events', href: '/events' },
    { title: 'Team', href: '/team' },
    { title: 'Gallery', href: '/gallery' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <RBNavbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
      <Container className="px-3" fluid>
        <RBNavbar.Brand as={Link} href="/" className="d-flex align-items-center m-0 column-gap-2">
          <Image src={"/assets/images/ppls-logo.png"} alt="PPLS Logo" width={50} height={50} roundedCircle />
          <h5 className="my-auto">PPL Solutions VTC</h5>
        </RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="main-navbar" />
        <RBNavbar.Collapse id="main-navbar">
          <Nav className="w-100 d-flex justify-content-center">
            {navLinks.map((link) => (
              <Nav.Link key={link.href} as={Link} href={link.href} className={`${pathname === link.href ? 'active' : ''} text-light fs-5 p-0 mx-2`}>{link.title}</Nav.Link>
            ))}
          </Nav>
          <Nav className="d-flex align-items-lg-center nav-buttons column-gap-2">
            {!loading && (
              showAuth ? (
              <>
                <Nav.Item className="me-2 d-flex align-items-center">
                  <span className="nav-link">Welcome, {user?.email}</span>
                </Nav.Item>
                <Nav.Item>
                  <Button variant="link" className="nav-link p-0" onClick={handleLogout}>Logout</Button>
                </Nav.Item>
              </>
            ) : (
              <>
                <ButtonSecondary href="/apply">Apply</ButtonSecondary>
                <ButtonSecondary href="/drivershub">Drivershub</ButtonSecondary>
              </>
            )
          )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default Navbar;
