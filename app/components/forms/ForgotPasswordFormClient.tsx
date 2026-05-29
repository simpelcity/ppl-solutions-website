"use client";

import { Container, Row, Col, Card, Form, Image } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib";
import { BSButton } from "@/components";
import "@/styles/AuthCards.scss";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { useTheme } from "next-themes";

type Props = {
  dict: Dictionary;
  lang: Locale;
}

export default function ForgotPasswordFormClient({ dict, lang }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { resolvedTheme } = useTheme();
  const currentLang = lang === 'en' ? '' : `/${lang}`;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const siteUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:8000";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}${currentLang}/reset-password`,
      });

      if (error) {
        console.error(error)
        setError(error.message);
        return;
      }

      setSuccess(`${dict.success.forgotPassword.RESET_EMAIL_SENT}`);
      setEmail("");
    } catch (err: any) {
      setError(err?.message ?? `${dict.errors.forgotPassword.UNEXPECTED}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card text-theme rounded-1 border-0 shadow-sm fs-6">
      <Card.Body className="p-4">
        <div className="d-flex mb-3">
          <Image
            src={`/assets/images/${resolvedTheme}/logo.png`}
            alt={dict.navbar.alt}
            width={20}
            height={20}
            roundedCircle
          />
          <small className="ms-1 my-auto">{dict.forgotPassword.form.brand}</small>
        </div>
        <h2 className="mb-3">{dict.forgotPassword.form.title}</h2>
        <p className="mb-4">{dict.forgotPassword.form.text}</p>

        <Form onSubmit={handleForgotPassword}>
          <Form.Group className="mb-3">
            <Form.Label>{dict.forgotPassword.form.email}</Form.Label>
            <Form.Control
              type="email"
              placeholder={dict.forgotPassword.form.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input rounded-1 border-0 shadow-sm"
              required
              disabled={loading}
            />
          </Form.Group>

          {error && <p className="text-danger mt-3 mb-3">{error}</p>}
          {success && <p className="text-success mt-3 mb-3">{success}</p>}

          <Form.Group className="mb-3">
            <BSButton variant="primary" type="submit" disabled={loading}>
              {loading ? `${dict.forgotPassword.form.statuses.loading}` : `${dict.forgotPassword.form.submit}`}
            </BSButton>
          </Form.Group>

          <div className="text-center">
            <small>
              {dict.forgotPassword.form.remember}{" "}
              <a href={`${currentLang}/login`} className="text-theme">
                {dict.forgotPassword.form.backToLogin}
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}