"use client";

import { Card, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { BSButton } from "@/components";
import "@/styles/AuthCards.scss";
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function ResetPasswordFormClient({ dict }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(data)
      if (event === 'PASSWORD_RECOVERY') {
        console.log('test')
      }
    })

    // const params = new URLSearchParams(window.location.search);
    // const accessToken = params.get("code") || params.get("token");
    // const type = params.get("type");

    // if (type === "recovery" && accessToken) {
    //   supabase.auth.verifyOtp({
    //     token_hash: accessToken,
    //     type: "recovery",
    //   })
    //     .then(({ data, error }) => {
    //       if (error || !data.session) {
    //         console.error(error)
    //         setError(dict.resetPassword.form.error.expiredToken);
    //         setTokenValid(false);
    //       } else {
    //         setTokenValid(true);
    //       }
    //     });
    // } else {
    //   console.log(error)
    //   setError(dict.resetPassword.form.error.invalidToken);
    // }
  }, [dict.resetPassword.form.error]);

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
      setError(dict.resetPassword.form.error.passwordMismatch);
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

      setSuccess(dict.resetPassword.form.error.success);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message ?? dict.resetPassword.form.error.unexpected);
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
              <a href="/forgot-password" className="text-light">{dict.resetPassword.form.error.newPassword}</a>
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
          <small className="ms-1 my-auto">{dict.resetPassword.form.brand}</small>
        </div>
        <h2 className="mb-3">{dict.resetPassword.form.title}</h2>
        <p className="text-muted mb-4">{dict.resetPassword.form.newPasswordBelow}</p>

        <Form onSubmit={handleResetPassword} data-bs-theme="dark">
          <Form.Group className="mb-3">
            <Form.Label>{dict.resetPassword.form.newPassword}</Form.Label>
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
            <Form.Label>{dict.resetPassword.form.confirmPassword}</Form.Label>
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
              {loading ? dict.resetPassword.form.loading : "Reset Password"}
            </BSButton>
          </Form.Group>

          <div className="text-center">
            <small>
              <a href="/login" className="text-light">{dict.resetPassword.form.backToLogin}</a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
