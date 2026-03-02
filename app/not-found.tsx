import { Container, Row, Col } from 'react-bootstrap'
import Card404 from '@/components/ui/cards/Card404'
import LayoutClient from '@/app/[lang]/LayoutClient'
import { getDictionary } from '@/app/i18n'
import { i18n, type Locale } from '@/i18n'
import { AuthProvider, SidebarProvider } from '@/lib'

export const metadata = {
  title: '404 | Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default async function NotFoundPage() {
  const lang = i18n.defaultLocale
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
                    <Card404 />
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
