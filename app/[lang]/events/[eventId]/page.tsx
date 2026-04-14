import { StartBanner, CardEventDetail } from "@/components"
import { Container, Row, Image } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"
import axios from "axios";
import '@/styles/Home.scss'

type PageProps = {
  params: Promise<{ lang: Locale, eventId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const { eventId } = await params

  const canonical = lang === 'en' ? '/events' : `/${lang}/events`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  const res = await axios.get(`https://api.truckersmp.com/v2/events/${eventId}`);
  if (res.status !== 200) throw new Error(dict.errors.events.FAILED_TO_FETCH_EVENTS, { cause: res.status });
  const data = res.data;
  const event = data.response;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${event.name} | PPL Solutions`,
    description: dict.events.meta.description,
    openGraph: {
      title: `${event.name} | PPL Solutions`,
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

export default async function EventDetailPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const { eventId } = await params

  const res = await axios.get(`https://api.truckersmp.com/v2/events/${eventId}`);
  if (res.status !== 200) throw new Error(dict.errors.events.FAILED_TO_FETCH_EVENTS, { cause: res.status });
  const data = res.data;
  const event = data.response;

  return (
    <>
      <main className="fs-5">
        {/* <StartBanner>{event.name}</StartBanner> */}
        <section className="d-flex w-100">
          <Container className="px-0 position-relative d-flex justify-content-center" fluid>
            <Image
              src={event.banner}
              alt={event.name}
              className="w-100 object-fit-cover"
              style={{ height: '500px' }}
            />
            <div className="position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-end">
              <h1 className="text-uppercase px-3 mb-3 text-center">{event.name}</h1>
            </div>
          </Container>
        </section>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center p-3">
            <Row className="d-flex justify-content-center row-gap-4">
              <CardEventDetail eventId={eventId} dict={dict} />
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}
