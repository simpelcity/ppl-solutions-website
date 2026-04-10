"use client";

import { Card, Form, Image, Alert } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components";
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function RegisterFormClient({ dict }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();

  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim()) return;
    setCheckingUsername(true);
    try {
      const response = await fetch('/api/check-display-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ display_name: username.trim() }),
      });
      const result = await response.json();
      if (!result.available) {
        setError(`${dict.errors.register.USERNAME_ALREADY_IN_USE}`);
      } else {
        setError("");
      }
    } catch (err) {
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const checkResponse = await fetch('/api/check-display-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ display_name: username.trim() }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResult.available) {
        setLoading(false);
        setError(`${dict.errors.register.USERNAME_ALREADY_IN_USE}`);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { username, display_name: username } },
      });

      setLoading(false);
      if (error) {
        if (error.code?.includes('user_already_exists')) {
          setError(`${dict.errors.register.EMAIL_ALREADY_IN_USE}`);
        } else if (error.code?.includes('weak_password')) {
          setError(`${dict.errors.register.PASSWORD_TOO_SHORT}`);
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(`${dict.success.register.ACCOUNT_CREATED}`);
      setTimeout(() => router.push("/login"), 900);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? `${dict.errors.register.UNEXPECTED}`);
    }
  };

  return (
    <>
      <Card className="login-card text-light rounded-0 border-0 shadow-sm fs-6">
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
            <small className="ms-1 my-auto">{dict.register.form.brand}</small>
          </div>
          <h2 className="mb-3">{dict.register.form.title}</h2>
          <Form method="post" onSubmit={handleRegister} className="" data-bs-theme="dark">
            <Form.Group className="mb-3">
              <Form.Label>{dict.register.form.email}</Form.Label>
              <Form.Control
                type="email"
                placeholder={dict.register.form.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input rounded-0 border-0 shadow-sm"
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{dict.register.form.username}</Form.Label>
              <Form.Control
                type="text"
                placeholder={dict.register.form.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={(e) => checkUsernameAvailability(e.target.value)}
                className="input rounded-0 border-0 shadow-sm"
                required
                disabled={loading}
              />
              <small className="text-muted">{dict.register.form.allowedChars}</small>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{dict.register.form.password}</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input rounded-0 border-0 shadow-sm"
                required
                disabled={loading}
              />
            </Form.Group>
            {error && <p className="text-danger mt-3">{error}</p>}
            {success && <p className="text-success mt-3">{success}</p>}
            <Form.Group className="mb-3">
              <BSButton variant="primary" type="submit" disabled={loading}>
                {loading ? `${dict.register.form.statuses.loading}` : `${dict.register.form.submit}`}
              </BSButton>
            </Form.Group>
            <div className="text-center">
              <small>
                {dict.register.form.haveAccount}{" "}
                <a href="/login" className="text-light">
                  {dict.register.form.login}
                </a>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}