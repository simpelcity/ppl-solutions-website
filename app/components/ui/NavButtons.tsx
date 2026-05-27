"use client"

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from 'next-themes'
import { Nav, Dropdown, Image } from 'react-bootstrap'
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { BSButton, ThemeSwitcher } from "@/components";
import { i18n, type Locale } from "@/i18n";
import type { Dictionary } from "@/app/i18n";
import { useAuth } from '@/lib'

type LanguageNamesProps = {
  [key in Locale]: {
    long: string;
    short: string;
    url: string;
    alt: string;
  }
}

export default function NavButtons({ dict, width, isMobile }: { dict: Dictionary, width: number, isMobile: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();

  const currentLocale = i18n.locales.find(
    (locale) => pathname?.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || i18n.defaultLocale;

  const drivershubHref = user
    ? (currentLocale === i18n.defaultLocale ? "/drivershub" : `/${currentLocale}/drivershub`)
    : (currentLocale === i18n.defaultLocale ? "/login" : `/${currentLocale}/login`);

  const languageNames: LanguageNamesProps = {
    en: {
      long: "English",
      short: "EN",
      url: "https://flagcdn.com/w320/gb.png",
      alt: "English Flag",
    },
    nl: {
      long: "Nederlands",
      short: "NL",
      url: "https://flagcdn.com/w320/nl.png",
      alt: "Nederlandse vlag",
    },
    cs: {
      long: "čeština",
      short: "ČR",
      url: "https://flagcdn.com/w320/cz.png",
      alt: "Česká vlajka",
    },
    sk: {
      long: "Slovák",
      short: "SK",
      url: "https://flagcdn.com/w320/sk.png",
      alt: "Vlajka Slovenska",
    },
  };

  const switchLanguage = (locale: Locale) => {
    let newPathname = pathname || "/";

    i18n.locales.forEach((loc) => {
      if (newPathname.startsWith(`/${loc}/`)) {
        newPathname = newPathname.replace(`/${loc}`, "");
      } else if (newPathname === `/${loc}`) {
        newPathname = "/";
      }
    });

    const finalPath = locale === i18n.defaultLocale
      ? newPathname
      : `/${locale}${newPathname}`;

    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;

    router.push(finalPath);
    setExpanded(false);
  };

  const offCanvas = width >= 992 && width <= 1150;

  return (
    <Nav className={`d-flex justify-content-center gap-2 ${offCanvas ? 'flex-column' : width < 576 ? 'flex-column' : 'flex-row'}`}>
      <div className="d-flex justify-content-center column-gap-2">
        <BSButton
          variant="secondary"
          border="primary 2"
          href={currentLocale === i18n.defaultLocale ? "/apply" : `/${currentLocale}/apply`}
          size="sm"
          onClick={() => setExpanded(false)}>
          {dict.navbar.buttons.apply}
        </BSButton>
        <BSButton
          variant="secondary"
          border="primary 2"
          href={drivershubHref}
          size="sm"
          onClick={() => setExpanded(false)}>
          {dict.navbar.buttons.drivershub}
        </BSButton>
      </div>
      <div className={`vr text-theme ${offCanvas ? 'd-none' : width < 576 ? 'd-none' : 'd-block'}`}></div>
      <div className="d-flex align-items-center justify-content-center column-gap-2">
        <Dropdown align="end" id="lang-dropdown" style={{ width: 'min-content' }} onToggle={(nextShow) => setIsLangDropdownOpen(Boolean(nextShow))}>
          <Dropdown.Toggle variant="transparent" className="border-0 d-flex align-items-center p-0 fw-semibold" id="dropdown-lang">
            <Image
              src={languageNames[currentLocale].url}
              alt={languageNames[currentLocale].alt}
              className="me-1"
              style={{ width: "25px", height: "17px" }}
            />
            {isMobile ? languageNames[currentLocale].long : languageNames[currentLocale].short}
            <span className={`ms-1 chevron-rotate-180 ${isLangDropdownOpen ? 'is-open' : ''}`}>
              <FaAngleDown />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-3 position-absolute rounded-1 border-0 shadow-sm py-0">
            {i18n.locales.map((locale) => (
              <Dropdown.Item
                className={`d-flex align-items-center fw-semibold`}
                key={locale}
                active={currentLocale === locale}
                onClick={() => switchLanguage(locale)}>
                <Image
                  src={languageNames[locale].url}
                  alt={languageNames[locale].alt}
                  className="w-25 h-25 me-2"
                />
                {languageNames[locale].long}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className={`vr text-theme ${offCanvas ? 'd-block' : width < 576 ? 'd-block' : 'd-none'}`}></div>
        <ThemeSwitcher />
      </div>
    </Nav>
  )
}