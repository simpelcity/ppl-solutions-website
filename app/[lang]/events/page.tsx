import { StartBanner, CardEvents } from "@/components/index"
import { Container, Row } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  events: {
    meta: {
      title: string,
      description: string
    }
    title: string,
    card: {
      date: string,
      meetupTime: string,
      departureTime: string,
      departureLocation: string,
      destinationLocation: string,
      game: string,
      server: string,
      dlc: string,
      event: string
    },
    error: {
      noEvents: string
      na: string,
      noServer: string,
      noDLC: string
    }
  }
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
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <main className="fs-5">
        <StartBanner>{dict.events.title}</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <CardEvents params={params} />
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}
