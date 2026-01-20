"use client";

import { Card, Form, Image, Alert } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib/";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components/";

type RegisterFormClientProps = {
  dict: {
    signup: {
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
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { username, display_name: username } },
      });

      setLoading(false);
      if (error) {
        if (error.message.includes("User already registered")) {
          setError(`${dict.signup.form.error.emailInUse}`);
        } else if (error.message.includes("Password should be at least 8 characters. Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789.")) {
          setError(`${dict.signup.form.error.passwordTooShort}`);
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(`${dict.signup.form.error.success}`);
      setTimeout(() => router.push("/login"), 900);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? `${dict.signup.form.error.unexpected}`);
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
            <small className="ms-1 my-auto">{dict.signup.form.brand}</small>
          </div>
          <h2 className="mb-3">{dict.signup.form.title}</h2>
          <Form method="post" onSubmit={handleRegister} className="" data-bs-theme="dark">
            <Form.Group className="mb-3">
              <Form.Label>{dict.signup.form.email}</Form.Label>
              <Form.Control
                type="email"
                placeholder={dict.signup.form.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input rounded-0 border-0 shadow"
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{dict.signup.form.username}</Form.Label>
              <Form.Control
                type="text"
                placeholder={dict.signup.form.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input rounded-0 border-0 shadow"
                required
                disabled={loading}
              />
              <small className="text-muted">{dict.signup.form.allowedChars}</small>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{dict.signup.form.password}</Form.Label>
              <Form.Control
                type="password"
                placeholder={dict.signup.form.passwordPlaceholder}
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
                {loading ? `${dict.signup.form.error.loading}` : `${dict.signup.form.submit}`}
              </BSButton>
            </Form.Group>
            <div className="text-center">
              <small>
                {dict.signup.form.haveAccount}{" "}
                <a href="/login" className="text-light">
                  {dict.signup.form.login}
                </a>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}