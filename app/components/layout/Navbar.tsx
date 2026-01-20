"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BSButton } from "@/components/";
import { Navbar as BSNavbar, Nav, Container, Image, Dropdown } from "react-bootstrap";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSidebar } from "@/lib/";
import { i18n, type Locale } from "@/i18n";
import type { Dictionary } from "@/app/i18n";
import "@/styles/Navbar.scss";

interface NavbarProps {
  dict: Dictionary;
}

const Navbar: React.FC<NavbarProps> = ({ dict }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const { toggleSidebar, isMobile } = useSidebar();
  const isDrivershub = pathname?.startsWith("/drivershub");

  // Extract current locale from pathname
  const currentLocale = i18n.locales.find(
    (locale) => pathname?.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || i18n.defaultLocale;

  const languageNames: Record<Locale, string> = {
    en: "EN",
    nl: "NL",
    cz: "ČR",
    sk: "SK",
  };

  const languageFlags: Record<Locale, string> = {
    en: "https://flagcdn.com/w320/gb.png",
    nl: "https://flagcdn.com/w320/nl.png",
    cz: "https://flagcdn.com/w320/cz.png",
    sk: "https://flagcdn.com/w320/sk.png",
  };

  const switchLanguage = (locale: Locale) => {
    // Get pathname without current locale prefix
    let newPathname = pathname || "/";

    // Remove current locale from pathname if present
    i18n.locales.forEach((loc) => {
      if (newPathname.startsWith(`/${loc}/`)) {
        newPathname = newPathname.replace(`/${loc}`, "");
      } else if (newPathname === `/${loc}`) {
        newPathname = "/";
      }
    });

    // Add new locale prefix if not default
    const finalPath = locale === i18n.defaultLocale
      ? newPathname
      : `/${locale}${newPathname}`;

    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;

    // Navigate to new path
    router.push(finalPath);
    setExpanded(false);
  };

  useEffect(() => {
    setExpanded(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

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
              style={{ padding: "0 0.75rem", fontSize: "30px" }}
              onClick={toggleSidebar}>
              <RxHamburgerMenu />
            </button>
          )}
          <BSNavbar.Brand
            as={Link}
            onClick={() => setExpanded(false)}
            href="/"
            className="d-flex align-items-center mx-0 ms-lg-3 me-lg-0 column-gap-2">
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
            <Nav className="d-flex align-items-center justify-content-center flex-row nav-buttons column-gap-2">
              <BSButton
                variant="secondary"
                border="primary 2"
                href={currentLocale === i18n.defaultLocale ? "/apply" : `/${currentLocale}/apply`}

                onClick={() => setExpanded(false)}>
                {dict.navbar.buttons.apply}
              </BSButton>
              <BSButton
                variant="secondary"
                border="primary 2"
                href={currentLocale === i18n.defaultLocale ? "/login" : `/${currentLocale}/login`}

                onClick={() => setExpanded(false)}>
                {dict.navbar.buttons.drivershub}
              </BSButton>
              <div className="vr d-block text-white"></div>
              <Dropdown align="end" data-bs-theme="dark" className="pe-3" style={{ width: 'min-content' }}>
                <Dropdown.Toggle variant="dark" className="bg-transparent border-0 text-light d-flex align-items-center py-0 ps-0 fw-semibold" id="dropdown-lang">
                  <Image
                    src={languageFlags[currentLocale]}
                    alt={languageNames[currentLocale]}
                    className="me-1 text-white"
                    style={{ width: "65%", height: "65%" }}
                  />
                  {languageNames[currentLocale]}
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-3 position-absolute">
                  {i18n.locales.map((locale) => (
                    <Dropdown.Item
                      className="d-flex align-items-center fw-semibold"
                      key={locale}
                      active={currentLocale === locale}
                      onClick={() => switchLanguage(locale)}>
                      <Image
                        src={languageFlags[locale]}
                        alt={languageNames[locale]}
                        className="w-25 h-25 me-2"
                      />
                      {languageNames[locale]}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </header>
  );
};

export default Navbar;

