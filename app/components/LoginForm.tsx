"use client"

import { Card, Form, Image } from "react-bootstrap"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { ButtonPrimary } from "@/components"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [remeber, setRemember] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Signed in via Supabase client — redirect
      router.push("/drivershub")
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "Unexpected error")
    }
  }

  return (
    <>
      <Card className="login-card text-light rounded-0 border-0 shadow fs-6">
        <Card.Body className="p-4">
          <div className="d-flex mb-3">
            <Image
              src={"/assets/images/ppls-logo.png"}
              alt="PPLS Logo"
              width={20}
              height={20}
              className=""
              roundedCircle
            />
            <small className="ms-1 my-auto">PPL Solutions</small>
          </div>
          <h2 className="mb-3">Log in</h2>
          <Form method="post" onSubmit={handleLogin} className="" data-bs-theme="dark">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input rounded-0 border-0 shadow"
              />
            </Form.Group>
            <Form.Group className="mb-2 d-flex justify-content-between align-items-center">
              <Form.Label className="m-0">Password</Form.Label>
              <a href="/forgot-password" className="text-light m-0">
                forgot password?
              </a>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input rounded-0 border-0 shadow"
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                id="rememberCheck"
                checked={remeber}
                onChange={(e) => setRemember(e.target.checked)}
                className="me-2"
                aria-label="Remember me"
              />
              <Form.Label className="m-0">Remember me</Form.Label>
            </Form.Group>
            {error && <p className="text-danger mt-3">{error}</p>}
            <Form.Group className="mb-3">
              <ButtonPrimary type="submit">Log in</ButtonPrimary>
            </Form.Group>
            <div className="text-center">
              <small>
                Don't have an account?{" "}
                <a href="/register" className="text-light">
                  Sign up
                </a>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
