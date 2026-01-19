import { Container, Row, Col } from "react-bootstrap"
import { StartBanner, CardContact } from "@/components/"
import "@/styles/Contact.scss"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  contact: {
    meta: {
      title: string,
      description: string
    },
    title: string,
    form: {
      required: string,
      name: string,
      namePlaceholder: string,
      email: string,
      emailPlaceholder: string,
      message: string,
      messagePlaceholder: string,
      submit: string
    }
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType
  return (
    <>
      <title>{`${dict.contact.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.contact.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.contact.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.contact.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/contact" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/contact" />

      <main className="fs-5">
        <StartBanner>{dict.contact.title}</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center flex-column align-items-center my-5">
            <p className="text-gray">{dict.contact.form.required}</p>
            <Row className="w-100 d-flex justify-content-center align-items-start g-4">
              <Col xs={12} md={12} xl={8}>
                <CardContact dict={dict} />
              </Col>
              <Col xs={12} md={8} xl={4} className="d-flex align-items-center justify-content-center">
                <iframe
                  className="shadow w-100"
                  src="https://discord.com/widget?id=1282025492354170972&theme=dark"
                  height="450"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

