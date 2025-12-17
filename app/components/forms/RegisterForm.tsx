"use client";

import { Card, Form, Image } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import BSButton from "../ui/Button";

export default function RegisterForm() {
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
        options: { data: { username, display } },
      });

      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }

      setSuccess("Registration successful. Please check your email to confirm.");
      setTimeout(() => router.push("/login"), 900);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? "Unexpected error during registration");
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
          <small className="ms-1 my-auto">PPL Solutions</small>
        </div>
        <h2 className="mb-3">Sign up</h2>
        <Form method="post" onSubmit={handleRegister} className="" data-bs-theme="dark">
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
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input rounded-0 border-0 shadow"
              required
              disabled={loading}
            />
            <small className="text-muted">3-50 characters, letters, numbers, underscores, hyphens</small>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••"
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
              {loading ? "Creating account..." : "Sign up"}
            </BSButton>
          </Form.Group>
          <div className="text-center">
            <small>
              Already have an account?{" "}
              <a href="/login" className="text-light">
                Sign in
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

