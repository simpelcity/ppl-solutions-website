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

  let event: any = null;

  try {
    const res = await axios.get(`https://api.truckersmp.com/v2/events/${eventId}`);
    if (res.status !== 200) throw new Error(dict.errors.events.FAILED_TO_FETCH_EVENTS, { cause: res.status });
    event = res.data?.response;
  } catch (err: any) {
    event = null;
  }

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${event ? event.name : dict.errors.events.details.EVENT_NOT_FOUND} | PPL Solutions VTC`,
    description: dict.events.meta.description,
    openGraph: {
      title: `${event ? event.name : dict.errors.events.details.EVENT_NOT_FOUND} | PPL Solutions VTC`,
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

  let event: any = null;
  let pageError: string | null = null;

  try {
    const res = await axios.get(`https://api.truckersmp.com/v2/events/${eventId}`);
    if (res.status !== 200) throw new Error(dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS, { cause: res.status });
    event = res.data?.response;
  } catch (err: any) {
    pageError = err?.response?.data?.message || dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS;
  }

  const bannerUrl = dict.errors.events.details.NO_BANNER.replace(" ", "+");

  return (
    <>
      <main className="fs-5 d-flex flex-column">
        <section className="d-flex w-100">
          <Container className="px-0 position-relative d-flex justify-content-center" fluid>
            <Image
              src={event ? event.banner : `https://placehold.co/1920x500/2b3035/808080?text=${bannerUrl}`}
              alt={event ? event.name : dict.errors.events.details.NO_BANNER}
              className="w-100 object-fit-cover"
              style={{ height: '500px' }}
            />
            <div className="position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
              <h1 className="text-uppercase px-3 mb-3 text-center text-light">{event ? event.name : dict.errors.events.details.EVENT_NOT_FOUND}</h1>
            </div>
          </Container>
        </section>

        <section className="d-flex w-100 bg-surface-darker text-center flex-grow-1">
          <Container className="d-flex justify-content-center p-3 p-md-4">
            <Row className="d-flex justify-content-center">
              {pageError ? (
                <div className="text-danger fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {pageError}</div>
              ) : (
                <CardEventDetail eventId={eventId} dict={dict} />
              )}
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}