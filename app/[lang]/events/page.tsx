import { StartBanner, CardEvents } from "@/components/index"
import { Container, Row } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

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

export default async function EventsPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.events.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.events.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.events.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.events.meta.description}
      />
      <meta property="og:url" content={`https://ppl-solutions.vercel.app/${lang}/events`} />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href={`https://ppl-solutions.vercel.app/${lang}/events`} />

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
