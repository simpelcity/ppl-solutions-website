"use client";

import { Container, Row, Col, Card, Form, Image } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib/";
import { BSButton } from "@/components/";
import "@/styles/AuthCards.scss";

type ForgotPasswordFormClientProps = {
  dict: {
    forgotPassword: {
      meta: {
        title: string,
        description: string
      },
      form: {
        brand: string,
        title: string,
        text: string,
        email: string,
        emailPlaceholder: string,
        submit: string,
        remember: string,
        backToLogin: string,
        error: {
          error: string,
          success: string,
          loading: string
        }
      }
    }
  }
}

export default function ForgotPasswordFormClient({ dict }: ForgotPasswordFormClientProps) {
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
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ppl-solutions.vercel.app";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(`${dict.forgotPassword.form.error.success}`);
      setEmail("");
    } catch (err: any) {
      setError(err?.message ?? `${dict.forgotPassword.form.error.error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <small className="ms-1 my-auto">{dict.forgotPassword.form.brand}</small>
        </div>
        <h2 className="mb-3">{dict.forgotPassword.form.title}</h2>
        <p className="text-light mb-4">
          {dict.forgotPassword.form.text}
        </p>

        <Form onSubmit={handleForgotPassword} data-bs-theme="dark">
          <Form.Group className="mb-3">
            <Form.Label>{dict.forgotPassword.form.email}</Form.Label>
            <Form.Control
              type="email"
              placeholder={dict.forgotPassword.form.emailPlaceholder}
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
              {loading ? `${dict.forgotPassword.form.error.loading}` : `${dict.forgotPassword.form.submit}`}
            </BSButton>
          </Form.Group>

          <div className="text-center">
            <small>
              {dict.forgotPassword.form.remember}{" "}
              <a href="/login" className="text-light">
                {dict.forgotPassword.form.backToLogin}
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}