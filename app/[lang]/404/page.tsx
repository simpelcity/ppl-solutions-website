import { Container, Row, Col } from 'react-bootstrap'
import Card404 from '@/components/ui/cards/Card404'
import { getDictionary } from '@/app/i18n'
import { type Locale } from '@/i18n'
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return {
    title: `${dict["not-found"].meta.title} | PPL Solutions`,
    description: dict["not-found"].meta.description,
  }
}

export default async function NotFoundPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    // <AuthProvider>
    //   <SidebarProvider>
    //     <LayoutClient dict={dict} lang={lang as Locale} forceHideFooter>
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
    //     </LayoutClient>
    //   </SidebarProvider>
    // </AuthProvider>
  )
}
