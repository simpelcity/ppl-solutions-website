import { Container, Row, Col } from "react-bootstrap"
import { LoginForm } from "@/components/"
import "@/styles/AuthCards.scss"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  login: {
    meta: {
      title: string,
      description: string
    },
    form: {
      brand: string,
      title: string,
      email: string,
      emailPlaceholder: string,
      password: string,
      passwordPlaceholder: string,
      forgotPassword: string,
      rememberMe: string,
      submit: string,
      noAccount: string;
      signUp: string;
      error: {
        invalidCredentials: string,
        unexpected: string,
        loading: string
      }
    }
  }
}

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.login.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.login.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.login.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.login.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/login" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/login" />

      <main className="fs-5 main">
        <section className="d-flex w-100 text-light">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <LoginForm params={params} />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

