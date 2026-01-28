import { Dashboard, DashboardStats } from "@/components/"
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

  const canonical = lang === 'en' ? '/drivershub/dashboard' : `/${lang}/drivershub/dashboard`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.drivershub.vtcStats.meta.title} | PPL Solutions`,
    description: dict.drivershub.vtcStats.meta.description,
    openGraph: {
      title: `${dict.drivershub.vtcStats.meta.title} | PPL Solutions`,
      description: dict.drivershub.vtcStats.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/drivershub/dashboard',
        'nl-NL': '/nl/drivershub/dashboard',
        'cs-CZ': '/cs/drivershub/dashboard',
        'sk-SK': '/sk/drivershub/dashboard',
      },
    },
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <section className="drivershub w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <Row className="w-100 d-flex px-3">
              <DashboardStats dict={dict.drivershub.vtcStats} />
            </Row>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

