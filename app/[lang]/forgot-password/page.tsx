import { Container, Row, Col } from "react-bootstrap";
import { ForgotPasswordForm } from "@/components/";
import "@/styles/AuthCards.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  forgotPassword: {
    meta: {
      title: string,
      description: string
    },
    form: {
      brand: string,
      title: string,
      description: string,
      email: string,
      emailPlaceholder: string,
      submit: string,
      remember: string,
      backToLogin: string,
      error: {
        error: string,
        success: string,
        loading: string
      }
    }
  }
}

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.forgotPassword.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.forgotPassword.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.forgotPassword.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.forgotPassword.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/forgot-password" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/forgot-password" />

      <main className="fs-5 main">
        <section className="d-flex w-100 text-light">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <ForgotPasswordForm params={params} />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}

