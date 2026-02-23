import { Container, Row, Col } from "react-bootstrap"
import { LoginForm } from "@/components/"
import "@/styles/AuthCards.scss"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/login' : `/${lang}/login`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.login.meta.title} | PPL Solutions`,
    description: dict.login.meta.description,
    openGraph: {
      title: `${dict.login.meta.title} | PPL Solutions`,
      description: dict.login.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/login',
        'nl-NL': '/nl/login',
        'cs-CZ': '/cs/login',
        'sk-SK': '/sk/login',
      },
    },
  }
}

export default function LoginPage({ params }: PageProps) {
  return (
    <>
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

