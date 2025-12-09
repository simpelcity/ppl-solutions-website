import { Container, Row, Col } from "react-bootstrap"
import { StartBanner, CardContact } from "@/components"
import "@/styles/Contact.scss"

export const metadata = {
  title: "Contact | PPL Solutions",
  description: "Welcome to PPL Solutions VTC's Contact page",
}

export default function ContactPage() {
  return (
    <>
      <main className="fs-5">
        <StartBanner>contact</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center flex-column align-items-center my-5">
            <p className="text-gray">Fields marked with * are required</p>
            <Row className="w-100 d-flex justify-content-center align-items-start g-4">
              <Col xs={12} md={12} xl={8}>
                <CardContact />
              </Col>
              <Col xs={12} md={8} xl={4} className="d-flex align-items-center justify-content-center">
                <iframe
                  className="shadow w-100"
                  src="https://discord.com/widget?id=1282025492354170972&theme=dark"
                  height="450"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

