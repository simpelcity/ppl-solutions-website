"use client"

import { Container, Row, Col, Card, Form, Image } from "react-bootstrap"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { ButtonPrimary } from "@/components"
import "@/styles/AuthCards.scss"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")
    const type = params.get("type")

    if (type === "recovery" && accessToken) {
      setTokenValid(true)
    } else {
      setError("Invalid or missing reset token. Please request a new password reset.")
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      setError(err?.message ?? "An error occurred while resetting your password")
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <>
        <title>Reset your password | PPL Solutions</title>
        <meta
          name="description"
          content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Reset your password | PPL Solutions" />
        <meta
          property="og:description"
          content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
        />
        <meta property="og:url" content="https://ppl-solutions.vercel.app/reset-password" />
        <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
        <link rel="canonical" href="https://ppl-solutions.vercel.app/reset-password" />

        <main className="fs-5 main">
          <section className="d-flex w-100 text-center">
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
                      <p className="text-danger">{error}</p>
                      <div className="text-center">
                        <small>
                          <a href="/forgot-password" className="text-light">
                            Request a new password reset
                          </a>
                        </small>
                      </div>
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

  return (
    <>
      <main className="fs-5 main">
        <section className="d-flex w-100 bg-dark-subtle text-center">
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
                    <h2 className="mb-3">Reset Password</h2>
                    <p className="text-muted mb-4">Enter your new password below.</p>

                    <Form onSubmit={handleResetPassword} data-bs-theme="dark">
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input rounded-0 border-0 shadow"
                          required
                          disabled={loading}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input rounded-0 border-0 shadow"
                          required
                          disabled={loading}
                        />
                      </Form.Group>
                      {error && <p className="text-danger mt-3 mb-3">{error}</p>}
                      {success && <p className="text-success mt-3 mb-3">{success}</p>}

                      <Form.Group className="mb-3">
                        <ButtonPrimary type="submit" disabled={loading}>
                          {loading ? "Resetting..." : "Reset Password"}
                        </ButtonPrimary>
                      </Form.Group>

                      <div className="text-center">
                        <small>
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

