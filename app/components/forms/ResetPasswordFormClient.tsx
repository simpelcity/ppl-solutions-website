"use client";

import { Card, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components";
import "@/styles/AuthCards.scss";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { useTheme } from "next-themes";
import { IoEyeOff, IoEye } from "react-icons/io5";

type Props = {
  dict: Dictionary;
  lang: Locale;
}

export default function ResetPasswordFormClient({ dict, lang }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { resolvedTheme } = useTheme();
  const currentLang = lang === 'en' ? '' : `/${lang}`;

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          setError(dict.errors.resetPassword.EXPIRED_TOKEN);
          setTokenValid(false);
        } else if (!data.session) {
          setError(dict.errors.resetPassword.EXPIRED_SESSION)
          setTokenValid(false)
        } else {
          setTokenValid(true);
        }
      })
      .catch(() => {
        setError(dict.errors.resetPassword.INVALID_TOKEN);
        setTokenValid(false);
      })
      .finally(() => {
        setValidating(false);
      });
  })

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return dict.errors.resetPassword.password.PASSWORD_TOO_SHORT;
    }
    if (!/[a-z]/.test(password)) {
      return dict.errors.resetPassword.password.PASSWORD_NO_LOWERCASE;
    }
    if (!/[A-Z]/.test(password)) {
      return dict.errors.resetPassword.password.PASSWORD_NO_UPPERCASE;
    }
    if (!/[0-9]/.test(password)) {
      return dict.errors.resetPassword.password.PASSWORD_NO_NUMBER;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return dict.errors.resetPassword.password.PASSWORD_NO_SPECIAL_CHARS;
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(dict.errors.resetPassword.password.PASSWORDS_MISMATCH);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(dict.resetPassword.form.success);
      setTimeout(() => {
        router.push(`${currentLang}/login`);
      }, 2000);
    } catch (err: any) {
      setError(err?.message ?? dict.errors.resetPassword.UNEXPECTED);
    } finally {
      setLoading(false);
    }
  };

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((prev) => !prev);
  }

  if (validating) {
    return (
      <Card className="auth-card text-theme rounded-1 border-0 shadow-sm fs-6">
        <Card.Body className="p-3 p-md-4">
          <div className="d-flex mb-3">
            <Image
              src={`/assets/images/${resolvedTheme}/logo.png`}
              alt={dict.navbar.alt}
              width={20}
              height={20}
              roundedCircle
            />
            <small className="ms-1 my-auto">{dict.resetPassword.form.brand}</small>
          </div>
          <p className="text-gray text-center">{dict.resetPassword.form.validating}</p>
        </Card.Body>
      </Card>
    );
  }

  if (!tokenValid) {
    return (
      <Card className="auth-card text-theme rounded-1 border-0 shadow-sm fs-6">
        <Card.Body className="p-3 p-md-4">
          <div className="d-flex mb-3">
            <Image
              src={`/assets/images/${resolvedTheme}/logo.png`}
              alt={dict.navbar.alt}
              width={20}
              height={20}
              roundedCircle
            />
            <small className="ms-1 my-auto">{dict.resetPassword.form.brand}</small>
          </div>
          <p className="text-danger">{error}</p>
          <div className="text-center">
            <small>
              <a href={`${currentLang}/forgot-password`} className="text-theme">{dict.resetPassword.form.requestNewPassword}</a>
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="auth-card text-theme rounded-1 border-0 shadow-sm fs-6">
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex mb-3">
          <Image
            src={`/assets/images/${resolvedTheme}/logo.png`}
            alt={dict.navbar.alt}
            width={20}
            height={20}
            roundedCircle
          />
          <small className="ms-1 my-auto">{dict.resetPassword.form.brand}</small>
        </div>
        <h2 className="mb-3">{dict.resetPassword.form.title}</h2>
        <p className="text-gray mb-3">{dict.resetPassword.form.newPasswordBelow}</p>

        <Form onSubmit={handleResetPassword}>
          <Form.Group className="mb-3">
            <Form.Label>{dict.resetPassword.form.newPassword}</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input rounded-1 border-0 shadow-sm"
                required
                disabled={loading}
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

          <Form.Group className="mb-3">
            <Form.Label>{dict.resetPassword.form.confirmPassword}</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input rounded-1 border-0 shadow-sm"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <IoEye className="text-primary" size={25} /> : <IoEyeOff className="text-gray" size={25} />}
              </button>
            </div>
          </Form.Group>
          {error && <p className="text-danger mt-3 mb-3">{error}</p>}
          {success && <p className="text-success mt-3 mb-3">{success}</p>}

          <Form.Group className="mb-3">
            <BSButton variant="primary" type="submit" disabled={loading}>
              {loading ? dict.resetPassword.form.loading : dict.resetPassword.form.submit}
            </BSButton>
          </Form.Group>

          <div className="text-center">
            <small>
              <a href={`${currentLang}/login`} className="text-theme">{dict.resetPassword.form.backToLogin}</a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
