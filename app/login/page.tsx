"use client"

import { Container, Row, Col } from "react-bootstrap"
import { LoginForm } from "@/components"
import "@/styles/Login.scss"

export default function LoginPage() {
  return (
    <>
      <main className="fs-5 main-login">
        <section className="d-flex w-100 text-light">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <LoginForm />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}
