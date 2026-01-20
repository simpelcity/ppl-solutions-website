"use client";

import { Card, Form, Image } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib/";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components/";

type LoginFormClientProps = {
  dict: {
    login: {
      meta: {
        title: string,
        description: string
      },
      form: {
        brand: string;
        title: string;
        email: string;
        emailPlaceholder: string;
        password: string;
        passwordPlaceholder: string;
        forgotPassword: string;
        rememberMe: string;
        submit: string;
        noAccount: string;
        signUp: string;
        error: {
          invalidCredentials: string,
          unexpected: string,
          loading: string
        }
      };
    }
  };
};

export default function LoginFormClient({ dict }: LoginFormClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setError(`${dict.login.form.error.invalidCredentials}`);
        return;
      }

      router.push("/drivershub");
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      setError(err?.message ?? `${dict.login.form.error.unexpected}`);
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
            className=""
            roundedCircle
          />
          <small className="ms-1 my-auto">{dict.login.form.brand}</small>
        </div>
        <h2 className="mb-3">{dict.login.form.title}</h2>
        <Form method="post" onSubmit={handleLogin} className="" data-bs-theme="dark">
          <Form.Group className="mb-3">
            <Form.Label>{dict.login.form.email}</Form.Label>
            <Form.Control
              type="email"
              placeholder={dict.login.form.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input rounded-0 border-0 shadow"
            />
          </Form.Group>
          <Form.Group className="mb-2 d-flex justify-content-between align-items-center">
            <Form.Label className="m-0">{dict.login.form.password}</Form.Label>
            <a href="/forgot-password" className="text-light m-0">
              {dict.login.form.forgotPassword}
            </a>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder={dict.login.form.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input rounded-0 border-0 shadow"
            />
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
              {loading ? `${dict.login.form.error.loading}` : `${dict.login.form.submit}`}
            </BSButton>
          </Form.Group>
          <div className="text-center">
            <small>
              {dict.login.form.noAccount}{" "}
              <a href="/register" className="text-light">
                {dict.login.form.signUp}
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}