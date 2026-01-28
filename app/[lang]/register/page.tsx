import { Container, Row, Col } from "react-bootstrap"
import { RegisterForm } from "@/components/"
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

  const canonical = lang === 'en' ? '/register' : `/${lang}/register`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.register.meta.title} | PPL Solutions`,
    description: dict.register.meta.description,
    openGraph: {
      title: `${dict.register.meta.title} | PPL Solutions`,
      description: dict.register.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/register',
        'nl-NL': '/nl/register',
        'cs-CZ': '/cs/register',
        'sk-SK': '/sk/register',
      },
    },
  }
}

export default function RegisterPage({ params }: PageProps) {
  return (
    <>
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

