import { CardTeamForm, Dashboard } from "@/components/"
import { Row, Col } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/Drivershub.scss"
import "@/styles/roles.scss"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/drivershub/dashboard/team' : `/${lang}/drivershub/dashboard/team`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.drivershub.team.meta.title} | PPL Solutions`,
    description: dict.drivershub.team.meta.description,
    openGraph: {
      title: `${dict.drivershub.team.meta.title} | PPL Solutions`,
      description: dict.drivershub.team.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/drivershub/dashboard/team',
        'nl-NL': '/nl/drivershub/dashboard/team',
        'cs-CZ': '/cs/drivershub/dashboard/team',
        'sk-SK': '/sk/drivershub/dashboard/team',
      },
    },
  }
}

export default async function DashboardTeamPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <section className="drivershub w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <Row className="w-100 justify-content-center">
              <CardTeamForm dict={dict.drivershub.team} />
            </Row>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

