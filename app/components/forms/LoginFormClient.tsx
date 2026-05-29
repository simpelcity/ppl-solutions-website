"use client";

import { Card, Form, Image } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { IoEyeOff, IoEye } from "react-icons/io5";

type Props = {
  dict: Dictionary;
  lang: Locale;
}

export default function LoginFormClient({ dict, lang }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { resolvedTheme } = useTheme();
  const currentLang = lang === 'en' ? '' : `/${lang}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      setLoading(false);
      if (error) {
        setError(`${dict.errors.login.INVALID_CREDENTIALS}`);
        return;
      }

      router.push(`${currentLang}/drivershub`);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      setError(err?.message ?? `${dict.errors.login.UNEXPECTED}`);
    }
  };

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <Card className="auth-card text-theme rounded-1 border-0 shadow-sm fs-6">
      <Card.Body className="p-4">
        <div className="d-flex mb-3">
          <Image
            src={`/assets/images/${resolvedTheme}/logo.png`}
            alt={dict.navbar.alt}
            width={20}
            height={20}
            className=""
            roundedCircle
          />
          <small className="ms-1 my-auto">{dict.login.form.brand}</small>
        </div>
        <h2 className="mb-3">{dict.login.form.title}</h2>
        <Form method="post" onSubmit={handleLogin} className="">
          <Form.Group className="mb-3">
            <Form.Label>{dict.login.form.email}</Form.Label>
              <Form.Control
                type="email"
                placeholder={dict.login.form.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input rounded-1 border-0 shadow-sm"
              />
          </Form.Group>
          <Form.Group className="mb-2 d-flex justify-content-between align-items-center">
            <Form.Label className="m-0">{dict.login.form.password}</Form.Label>
            <a href={`${currentLang}/forgot-password`} className="text-theme m-0 primary-link">
              {dict.login.form.forgotPassword}
            </a>
          </Form.Group>
          <Form.Group className="mb-3">
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input rounded-1 border-0 shadow-sm pe-5"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEye className="text-primary" size={25} /> : <IoEyeOff className="text-gray" size={25} />}
              </button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id="rememberCheck"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="me-2"
              aria-label={dict.login.form.rememberMe}
            />
            <Form.Label className="m-0">{dict.login.form.rememberMe}</Form.Label>
          </Form.Group>
          {error && <p className="text-danger mt-3">{error}</p>}
          <Form.Group className="mb-3">
            <BSButton variant="primary" type="submit">
              {loading ? `${dict.login.form.statuses.loading}` : `${dict.login.form.submit}`}
            </BSButton>
          </Form.Group>
          <div className="text-center">
            <small>
              {dict.login.form.noAccount}{" "}
              <a href={`${currentLang}/register`} className="text-theme primary-link">
                {dict.login.form.signUp}
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}