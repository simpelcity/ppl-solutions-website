"use client"

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Nav, Dropdown, Image } from 'react-bootstrap'
import { BSButton } from "@/components/";
import { i18n, type Locale } from "@/i18n";
import type { Dictionary } from "@/app/i18n";

export default function NavButtons({ dict, width }: { dict: Dictionary, width: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // Extract current locale from pathname
  const currentLocale = i18n.locales.find(
    (locale) => pathname?.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || i18n.defaultLocale;

  const languageNames: Record<Locale, string> = {
    en: "EN",
    nl: "NL",
    cs: "ČR",
    sk: "SK",
  };

  const languageFlags: Record<Locale, string> = {
    en: "https://flagcdn.com/w320/gb.png",
    nl: "https://flagcdn.com/w320/nl.png",
    cs: "https://flagcdn.com/w320/cz.png",
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

  const offCanvas = width > 992 && width < 1080;
  const mobile = width < 992;

  return (
    <Nav className={`d-flex justify-content-center gap-2 ${offCanvas ? 'flex-column' : width <= 576 ? 'flex-column' : 'flex-row'}`}>
      <div className="d-flex justify-content-center column-gap-2">
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
      </div>
      <div className={`vr text-white ${offCanvas ? 'd-none' : width <= 576 ? 'd-none' : 'd-block'}`}></div>
      <div className="d-flex align-items-center justify-content-center">
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
      </div>
    </Nav>
  )
}