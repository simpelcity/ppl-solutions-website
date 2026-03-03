import { Container, Row, Col } from 'react-bootstrap'
import Card404 from '@/components/ui/cards/Card404'
import { getDictionary } from '@/app/i18n'
import { i18n, type Locale } from '@/i18n'
import { cookies } from "next/headers"
import { AuthProvider, SidebarProvider } from "@/lib"
import LayoutClient from "./[lang]/LayoutClient"

export const metadata = {
  title: '404 | Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default async function NotFoundPage() {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  const lang = (cookieLocale && i18n.locales.includes(cookieLocale as Locale)
    ? cookieLocale
    : i18n.defaultLocale) as Locale
  const dict = await getDictionary(lang)

  return (
    <AuthProvider>
      <SidebarProvider>
        <LayoutClient dict={dict} lang={lang as Locale} forceHideFooter>
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
      </SidebarProvider>
    </AuthProvider>
  )
}
