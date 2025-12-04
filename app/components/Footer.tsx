"use client"

import { Container, Row, Col, Image, Tab, Tabs, ListGroup } from "react-bootstrap"
import { FaDiscord, FaTiktok, FaTruck, FaRegCopyright } from "react-icons/fa"
import { IconContext } from "react-icons"
import { FooterLink } from "@/components"
import "@/styles/Footer.scss"

export default function Footer() {
  const footerLinks = [
    { title: "Home", href: "" },
    { title: "Events", href: "events" },
    { title: "Team", href: "team" },
    { title: "Gallery", href: "gallery" },
    { title: "Contact", href: "contact" },
  ]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light py-4">
      <Container className="px-3 d-flex flex-column align-items-center" fluid>
        <Row className="w-100 d-flex row-gap-4">
          <Col
            xs={12}
            md={12}
            xl={6}
            className="d-flex flex-column align-items-center text-center align-items-xl-start text-xl-start">
            <div className="d-flex align-items-center mb-3">
              <a href="/" className="d-flex flex-row text-decoration-none text-light column-gap-2">
                <Image src={"/assets/images/ppls-logo.png"} alt="PPLS Logo" width={50} height={50} roundedCircle />
                <h3 className="my-auto">PPL Solutions VTC</h3>
              </a>
            </div>
            <p className="fs-5">
              Founded on 7 September 2024, our goal is to create a community where people can connect and enjoy trucking
              together.
            </p>
            <div className="d-flex flex-row column-gap-3">
              <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaDiscord className="bg-discord p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
              <a href="https://www.tiktok.com/@pplsolutionsvtc" target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaTiktok className="bg-tiktok p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
              <a href="https://truckersmp.com/vtc/74455" target="_blank" className="text-light">
                <IconContext.Provider value={{ className: "react-icons" }}>
                  <FaTruck className="bg-tmp p-2 rounded-circle" />
                </IconContext.Provider>
              </a>
            </div>
          </Col>
          <Col xs={12} md={12} xl={6}>
            <Row className="d-flex row-gap-4 w-100">
              <Col xs={12} md={3} lg={4}>
                <h3>Pages</h3>
                <ListGroup className="fs-5">
                  {footerLinks.map((item) => (
                    <FooterLink key={item.href} link={item.href}>
                      {item.title}
                    </FooterLink>
                  ))}
                </ListGroup>
              </Col>
              <Col xs={12} md={9} lg={8} className="fs-5">
                <Tabs defaultActiveKey="links" className="nav-fill mb-3 border-primary">
                  <Tab eventKey="links" title="Other links" className="border-0">
                    <ListGroup>
                      <FooterLink link="drivershub">Drivershub</FooterLink>
                      <FooterLink link="apply">Apply</FooterLink>
                      <FooterLink href="https://truckersmp.com/vtc/74455" target="_blank">
                        VTC
                      </FooterLink>
                    </ListGroup>
                  </Tab>
                  <Tab eventKey="message" title="Message" className="border-0">
                    <p className="text-center text-md-start">
                      Hello there traveler, My name is <strong>Simpelcity</strong>. Welcome on the website of the
                      Virtual Trucking Company: <strong>PPL Solutions</strong>, we stand for driver comfort and the fun
                      in doing great things together.
                    </p>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
        <p className="border-top border-light pt-3 mt-4 mb-0 fs-5 text-center w-100">
          <FaRegCopyright className="fs-6" /> Copyright {currentYear} <strong>PPL Solutions.</strong> All rights
          Reserved | Developed by{" "}
          <a className="text-decoration-none author fw-bold" href="https://simpelcity.github.io">
            Simpelcity
          </a>
        </p>
      </Container>
    </footer>
  )
}
