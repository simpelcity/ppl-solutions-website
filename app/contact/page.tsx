import { Container, Row, Col } from "react-bootstrap"
import { StartBanner, CardContact } from "@/components/"
import "@/styles/Contact.scss"

export default function ContactPage() {
  return (
    <>
      <title>Contact | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Contact | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/contact" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/contact" />

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

