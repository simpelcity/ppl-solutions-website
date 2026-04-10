import { StartBanner, CardEvents } from "@/components"
import { Container, Row } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/events' : `/${lang}/events`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.events.meta.title} | PPL Solutions`,
    description: dict.events.meta.description,
    openGraph: {
      title: `${dict.events.meta.title} | PPL Solutions`,
      description: dict.events.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/events',
        'nl-NL': '/nl/events',
        'cs-CZ': '/cs/events',
        'sk-SK': '/sk/events',
      },
    },
  }
}

export default async function EventsPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <StartBanner>{dict.events.title}</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center p-3">
            <Row className="d-flex justify-content-center row-gap-4">
              <CardEvents dict={dict} />
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}
