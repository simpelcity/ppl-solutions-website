"use client";

import { Card, Form, Image, Alert } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib/";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components/";

type RegisterFormClientProps = {
  dict: {
    register: {
      form: {
        brand: string;
        title: string;
        email: string;
        emailPlaceholder: string;
        username: string;
        usernamePlaceholder: string;
        allowedChars: string;
        password: string;
        passwordPlaceholder: string;
        submit: string;
        haveAccount: string;
        login: string;
        error: {
          emailInUse: string,
          usernameInUse: string,
          passwordTooShort: string,
          unexpected: string,
          success: string,
          loading: string
        }
      };
    };
  };
};

export default function RegisterFormClient({ dict }: RegisterFormClientProps) {
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
        setError(`${dict.register.form.error.usernameInUse}`);
      } else {
        setError(""); // Clear error if available
      }
    } catch (err) {
      // Ignore errors during check
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
      // Check if display_name is available
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
        setError(`${dict.register.form.error.usernameInUse}`);
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
          setError(`${dict.register.form.error.emailInUse}`);
        } else if (error.code?.includes('weak_password')) {
          setError(`${dict.register.form.error.passwordTooShort}`);
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(`${dict.register.form.error.success}`);
      setTimeout(() => router.push("/login"), 900);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? `${dict.register.form.error.unexpected}`);
    }
  };

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
                className="input rounded-0 border-0 shadow"
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
                className="input rounded-0 border-0 shadow"
                required
                disabled={loading}
              />
              <small className="text-muted">{dict.register.form.allowedChars}</small>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{dict.register.form.password}</Form.Label>
              <Form.Control
                type="password"
                placeholder={dict.register.form.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input rounded-0 border-0 shadow"
                required
                disabled={loading}
              />
            </Form.Group>
            {error && <p className="text-danger mt-3">{error}</p>}
            {success && <p className="text-success mt-3">{success}</p>}
            <Form.Group className="mb-3">
              <BSButton variant="primary" type="submit" disabled={loading}>
                {loading ? `${dict.register.form.error.loading}` : `${dict.register.form.submit}`}
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