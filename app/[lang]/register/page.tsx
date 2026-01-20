import { Container, Row, Col } from "react-bootstrap"
import { RegisterForm } from "@/components/"
import "@/styles/AuthCards.scss"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  signup: {
    meta: {
      title: string,
      description: string
    },
    form: {
      title: string,
      email: string,
      emailPlaceholder: string,
      username: string,
      usernamePlaceholder: string,
      allowedChars: string,
      password: string,
      passwordPlaceholder: string,
      submit: string,
      haveAccount: string,
      login: string,
      error: {
        emailInUse: string,
        passwordTooShort: string,
        unexpected: string,
        success: string,
        loading: string
      }
    }
  }
}

export default async function RegisterPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.signup.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.signup.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.signup.meta.title}`} />
      <meta
        property="og:description"
        content={dict.signup.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/register" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/register" />

      <main className="fs-5 main">
        <section className="d-flex w-100 text-light">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={5} xxl={4}>
                <RegisterForm params={params} />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

