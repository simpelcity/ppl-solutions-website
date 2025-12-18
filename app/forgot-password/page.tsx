"use client";

import { Container, Row, Col, Card, Form, Image } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BSButton from "@/components/ui/Button";
import "@/styles/AuthCards.scss";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: "https://ppl-solutions.vercel.app/reset-password",
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess("Password reset email sent! Check your inbox for a link to reset your password.");
      setEmail("");
    } catch (err: any) {
      setError(err?.message ?? "An error occurred while sending the reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Forgot your password? | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Forgot your password? | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/forgot-password" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/forgot-password" />

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
                        <BSButton variant="primary" type="submit" disabled={loading}>
                          {loading ? "Sending..." : "Send Reset Email"}
                        </BSButton>
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
  );
}

