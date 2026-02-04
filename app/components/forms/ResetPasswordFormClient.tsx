"use client";

import { Card, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { BSButton } from "@/components/";
import "@/styles/AuthCards.scss";

type ResetPasswordFormClientProps = {
  dict: {
    resetPassword: {
      meta: {
        title: string,
        description: string
      },
      form: {
        brand: string,
        title: string,
        newPassword: string,
        newPasswordPlaceholder: string,
        confirmPassword: string,
        confirmPasswordPlaceholder: string,
        submit: string,
        backToLogin: string,
        error: {
          invalidToken: string,
          passwordMismatch: string,
          passwordTooShort: string,
          success: string,
          unexpected: string,
          newPassword: string,
          loading: string
        }
      }
    }
  }
}

export default function ResetPasswordFormClient({ dict }: ResetPasswordFormClientProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const type = params.get("type");

    if (type === "recovery" && accessToken) {
      // Verify token with server
      supabase.auth.getUser(accessToken)
        .then(({ data, error }) => {
          if (error || !data.user) {
            setError("Invalid or expired reset token");
            setTokenValid(false);
          } else {
            setTokenValid(true);
          }
        });
    } else {
      setError("Invalid or missing reset token.");
    }
  }, []);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message ?? "An error occurred while resetting your password");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
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
            <small className="ms-1 my-auto">PPL Solutions</small>
          </div>
          <p className="text-danger">{error}</p>
          <div className="text-center">
            <small>
              <a href="/forgot-password" className="text-light">
                Request a new password reset
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

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
          <small className="ms-1 my-auto">PPL Solutions</small>
        </div>
        <h2 className="mb-3">Reset Password</h2>
        <p className="text-muted mb-4">Enter your new password below.</p>

        <Form onSubmit={handleResetPassword} data-bs-theme="dark">
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input rounded-0 border-0 shadow"
              required
              disabled={loading}
            />
          </Form.Group>
          {error && <p className="text-danger mt-3 mb-3">{error}</p>}
          {success && <p className="text-success mt-3 mb-3">{success}</p>}

          <Form.Group className="mb-3">
            <BSButton variant="primary" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </BSButton>
          </Form.Group>

          <div className="text-center">
            <small>
              <a href="/login" className="text-light">
                Back to login
              </a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
