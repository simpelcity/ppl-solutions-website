"use client";

import { Container, Row, Col } from "react-bootstrap";
import { ResetPasswordForm } from "@/components/";
import "@/styles/AuthCards.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
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

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.resetPassword.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.resetPassword.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.resetPassword.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.resetPassword.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/forgot-password" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/forgot-password" />

      <main className="fs-5 main">
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <ResetPasswordForm params={params} />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}

