import { Container, Row, Col } from 'react-bootstrap'
import { Card404 } from '@/components'
import { getDictionary } from '@/app/i18n'
import { i18n, type Locale } from '@/i18n'
import { cookies } from "next/headers"
import { AuthProvider, SidebarProvider } from "@/lib"
import LayoutClient from "./[lang]/LayoutClient"
import { type Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  const lang = (cookieLocale && i18n.locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : i18n.defaultLocale) as Locale
  const dict = await getDictionary(lang)

  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.notFound.meta.title} | PPL Solutions`,
    description: dict.notFound.meta.description,
    openGraph: {
      title: `${dict.notFound.meta.title} | PPL Solutions`,
      description: dict.notFound.meta.description,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      languages: {
        'en-US': '/drivershub/dashboard',
        'nl-NL': '/nl/drivershub/dashboard',
        'cs-CZ': '/cs/drivershub/dashboard',
        'sk-SK': '/sk/drivershub/dashboard',
      },
    },
  }
}

export default async function NotFoundPage() {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  const lang = (cookieLocale && i18n.locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : i18n.defaultLocale) as Locale
  const dict = await getDictionary(lang)

  return (
    <LayoutClient dict={dict} lang={lang as Locale} forceHideFooter forceHideDashboard>
      <main className="main">
        <section className="d-flex w-100 text-light">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={6}>
                <Card404 dict={dict} lang={lang} />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </LayoutClient>
  )
}
