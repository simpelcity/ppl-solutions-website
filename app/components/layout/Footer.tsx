"use client"

import { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Tab, Tabs, ListGroup } from "react-bootstrap"
import { FaDiscord, FaTiktok, FaInstagram, FaTruck, FaRegCopyright } from "react-icons/fa"
import { IconContext } from "react-icons"
import { FooterLink, BSLink } from "@/components"
import "@/styles/Footer.scss"
import type { Dictionary } from "@/app/i18n";
import { type Locale } from "@/i18n"
import { useSidebar } from "@/lib";
import { useTheme } from 'next-themes'

type FooterProps = {
  dict: Dictionary
  lang: Locale
}

export default function Footer({ dict, lang }: FooterProps) {
  const { isSidebarCollapsed } = useSidebar();

  const currentLocale = lang === "en" ? "" : `/${lang}`;
  const { resolvedTheme } = useTheme();

  const footerLinks = [
    { title: `${dict.footer.footer2.pages.home}`, href: `${currentLocale}/` },
    { title: `${dict.footer.footer2.pages.events}`, href: `${currentLocale}/events` },
    { title: `${dict.footer.footer2.pages.team}`, href: `${currentLocale}/team` },
    { title: `${dict.footer.footer2.pages.gallery}`, href: `${currentLocale}/gallery` },
    { title: `${dict.footer.footer2.pages.contact}`, href: `${currentLocale}/contact` },
  ];

  const currentYear = new Date().getFullYear()

  const split = dict.footer.footer3.tab2.text.split(" ");
  const message1 = split.slice(0, split.indexOf("Simpelcity.")).join(" ");
  const message2 = dict.footer.footer3.tab2.text.match(/\bSimpelcity\b/);
  const start1 = dict.footer.footer3.tab2.text.indexOf("Simpelcity") + "Simpelcity".length;
  const end1 = dict.footer.footer3.tab2.text.indexOf("PPL Solutions");
  const message3 = dict.footer.footer3.tab2.text.slice(start1, end1);
  const message4 = dict.footer.footer3.tab2.text.match(/\bPPL Solutions\b/);
  const message5 = dict.footer.footer3.tab2.text.slice(end1 + "PPL Solutions".length);

  const bottom1 = dict.footer.bottom.copyright.split(" ")[0];
  const brand = dict.footer.bottom.copyright.match(/\bPPL Solutions\b/);
  const start2 = dict.footer.bottom.copyright.indexOf("PPL Solutions") + "PPL Solutions".length;
  const end2 = dict.footer.bottom.copyright.indexOf("Simpelcity");
  const bottom3 = dict.footer.bottom.copyright.slice(start2, end2);
  const developer = dict.footer.bottom.copyright.slice(end2);

  const brandSplit = dict.footer.footer1.brand.split(" ");
  const brand1 = brandSplit[0] + (brandSplit.length > 1 ? " " : "") + (brandSplit.length > 1 ? brandSplit[1] : "");
  const brand2 = brandSplit[2];

  return (
    <footer className="bg-surface text-theme py-4">
      <Container className="px-3 d-flex flex-column align-items-center" fluid>
        <Row className="w-100 d-flex row-gap-4">
          <Col
            xs={12}
            md={12}
            xl={isSidebarCollapsed ? 6 : 5}
            className="d-flex flex-column align-items-center text-center align-items-xl-start text-xl-start">
            <div className="d-flex align-items-center mb-3">
              <a href={`${lang === 'en' ? '/' : currentLocale}`} className="d-flex flex-row text-decoration-none text-theme column-gap-2">
                <Image
                  src={`/assets/images/${resolvedTheme}/logo.png`}
                  alt={dict.navbar.alt}
                  loading="lazy"
                  width={50}
                  height={50}
                  roundedCircle
                />
                <span className="my-auto">
                  <span className={`font-freestyle fw-normal fs-1`}>{brand1}</span>{" "}
                  <span className={`font-freestyle fw-normal fs-1`}>{brand2}</span>
                </span>
                {/* <h3 className="my-auto">{dict.footer.footer1.brand}</h3> */}
              </a>
            </div>
            <p className="fs-5">
              {dict.footer.footer1.text}
            </p>
            <div className="d-flex flex-row column-gap-3">
              <a href="https://discord.gg/mnKcKwsYm4" title={dict.footer.footer1.socials.discord} target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaDiscord className="bg-discord p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
              <a href="https://www.tiktok.com/@pplsolutionsvtc" title={dict.footer.footer1.socials.tiktok} target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaTiktok className="bg-tiktok p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
              <a href="https://www.instagram.com/ppl.solutions" title={dict.footer.footer1.socials.instagram} target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaInstagram className="bg-instagram p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
              <a href="https://truckersmp.com/vtc/74455" title={dict.footer.footer1.socials.truckersmp} target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaTruck className="bg-tmp p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
            </div>
          </Col>
          <Col xs={12} md={12} xl={isSidebarCollapsed ? 6 : 7}>
            <Row className="d-flex row-gap-4 w-100">
              <Col xs={12} md={3} lg={4}>
                <h3>{dict.footer.footer2.title}</h3>
                <ListGroup className="fs-5">
                  {footerLinks.map((item) => (
                    <FooterLink key={item.href} link={item.href}>
                      {item.title}
                    </FooterLink>
                  ))}
                </ListGroup>
              </Col>
              <Col xs={12} md={9} lg={8} className="fs-5">
                <Tabs defaultActiveKey="links" className="mb-3" fill>
                  <Tab eventKey="links" title={dict.footer.footer3.tab1.title}>
                    <ListGroup>
                      <FooterLink link={`${currentLocale}/drivershub`}>{dict.footer.footer3.tab1.pages.drivershub}</FooterLink>
                      <FooterLink link={`${currentLocale}/apply`}>{dict.footer.footer3.tab1.pages.apply}</FooterLink>
                      <FooterLink href="https://truckersmp.com/vtc/74455" target="_blank">
                        {dict.footer.footer3.tab1.pages.vtc}
                      </FooterLink>
                    </ListGroup>
                  </Tab>
                  <Tab eventKey="message" title={dict.footer.footer3.tab2.title} className="">
                    <p className="text-center text-md-start">
                      {message1} <strong>{message2}</strong>{message3}<strong>{message4}</strong>{message5}
                    </p>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
        <p className="border-top border-light pt-3 mt-4 mb-0 fs-5 text-center w-100">
          <FaRegCopyright className="fs-6" /> {bottom1} {currentYear} <strong>{brand}</strong>{bottom3}
          <BSLink href="https://simpelcity.github.io" variant="primary" target="_blank" classes="author fw-bold">
            {developer}
          </BSLink>
        </p>
      </Container>
    </footer>
  )
}

