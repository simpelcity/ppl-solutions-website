import { Container, Row, Col } from "react-bootstrap"
import { RegisterForm } from "@/components"
import "@/styles/AuthCards.scss"

export default function RegisterPage() {
  return (
    <>
      <main className="fs-5 main">
        <section className="d-flex w-100 text-light">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <RegisterForm />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}
