"use client"

import { Container, Row, Col, Card, Form, Image } from "react-bootstrap"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { ButtonPrimary } from "@/components"
import type { Metadata } from "next"
import "@/styles/AuthCards.scss"

export const metadata: Metadata = {
  title: "Forgot your password? | PPL Solutions",
  description: "Welcome to PPL Solutions VTC's Forgot password page",
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess("Password reset email sent! Check your inbox for a link to reset your password.")
      setEmail("")
    } catch (err: any) {
      setError(err?.message ?? "An error occurred while sending the reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="fs-5 main">
        <section className="d-flex w-100 text-light">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <Card className="login-card text-light rounded-0 border-0 shadow fs-6">
                  <Card.Body className="p-4">
                    <div className="d-flex mb-3">
                      <Image
                        src={"/assets/images/ppls-logo.png"}
                        alt="PPLS Logo"
                        width={20}
                        height={20}
                        roundedCircle
                      />
                      <small className="ms-1 my-auto">PPL Solutions</small>
                    </div>
                    <h2 className="mb-3">Forgot Password?</h2>
                    <p className="text-light mb-4">
                      Enter your email and we'll send you a link to reset your password.
                    </p>

                    <Form onSubmit={handleForgotPassword} data-bs-theme="dark">
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input rounded-0 border-0 shadow"
                          required
                          disabled={loading}
                        />
                      </Form.Group>

                      {error && <p className="text-danger mt-3 mb-3">{error}</p>}
                      {success && <p className="text-success mt-3 mb-3">{success}</p>}

                      <Form.Group className="mb-3">
                        <ButtonPrimary type="submit" disabled={loading}>
                          {loading ? "Sending..." : "Send Reset Email"}
                        </ButtonPrimary>
                      </Form.Group>

                      <div className="text-center">
                        <small>
                          Remember your password?{" "}
                          <a href="/login" className="text-light">
                            Back to login
                          </a>
                        </small>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

