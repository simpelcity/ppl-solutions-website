import { Container, Row, Col } from "react-bootstrap"
import { StartBanner, CardContact } from "@/components"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"
import DiscordWidget from "./DiscordWidget"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/contact' : `/${lang}/contact`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.contact.meta.title} | PPL Solutions`,
    description: dict.contact.meta.description,
    openGraph: {
      title: `${dict.contact.meta.title} | PPL Solutions`,
      description: dict.contact.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/contact',
        'nl-NL': '/nl/contact',
        'cs-CZ': '/cs/contact',
        'sk-SK': '/sk/contact',
      },
    },
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <StartBanner>{dict.contact.title}</StartBanner>
        <section className="d-flex w-100 bg-surface-darker text-center">
          <Container className="d-flex justify-content-center flex-column align-items-center p-3 p-md-4">
            <p className="text-gray mb-3 mb-md-4">{dict.contact.form.required}</p>
            <Row className="w-100 d-flex justify-content-center align-items-start row-gap-3 row-gap-md-4">
              <Col xs={12} md={12} xl={8}>
                <CardContact dict={dict} />
              </Col>
              <Col xs={12} md={8} xl={4} className="d-flex align-items-center justify-content-center">
                <DiscordWidget />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

