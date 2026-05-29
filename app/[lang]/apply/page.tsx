import { Container, Card, CardBody, CardTitle, Row, Col } from "react-bootstrap"
import { StartBanner } from "@/components"
import { FaDiscord, FaTiktok, FaInstagram, FaTruck } from "react-icons/fa"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/apply' : `/${lang}/apply`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.apply.meta.title} | PPL Solutions`,
    description: dict.apply.meta.description,
    openGraph: {
      title: `${dict.apply.meta.title} | PPL Solutions`,
      description: dict.apply.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/apply',
        'nl-NL': '/nl/apply',
        'cs-CZ': '/cs/apply',
        'sk-SK': '/sk/apply',
      },
    },
  }
}

export default async function ApplyPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const split = dict.apply.card.text.split(" ");
  const apply1 = split.slice(0, split.indexOf("Discord")).join(" ") + " ";
  const apply2 = dict.apply.card.text.match(/\bDiscord\b/);
  const start = dict.apply.card.text.indexOf("Discord");
  const apply3 = dict.apply.card.text.slice(start + "Discord".length);

  return (
    <>
      <main className="fs-5">
        <StartBanner dict={dict}>{dict.apply.title}</StartBanner>
        <section className="d-flex w-100 bg-surface-darker text-center">
          <Container className="d-flex justify-content-center p-3 p-md-4">
            <Row className="w-100 d-flex justify-content-center">
              <Col xs={12} md={10} xl={7}>
                <Card className="bg-surface text-theme border-0 shadow-sm rounded-1">
                  <CardBody className="p-3 p-md-4">
                    <CardTitle>
                      {apply1}
                      <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="text-decoration-none fw-bold text-primary">
                        {apply2}
                      </a>{" "}
                      {apply3}
                    </CardTitle>
                    <Row className="d-flex justify-content-center row-gap-3 row-gap-md-4 mt-3 mt-md-4">
                      <Col xs={4} md={3}>
                        <div className="m-0 d-flex flex-column align-items-center">
                          <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="me-1">
                            <FaDiscord className="react-icons discord-icon p-1" />
                          </a>
                          <p className="m-0">Discord</p>
                        </div>
                      </Col>
                      <Col xs={4} md={3}>
                        <div className="m-0 d-flex flex-column align-items-center">
                          <a href="" target="_blank" className="me-1">
                            <FaTiktok className="react-icons tiktok-icon p-1" />
                          </a>
                          <p className="m-0">TikTok</p>
                        </div>
                      </Col>
                      <Col xs={4} md={3}>
                        <div className="m-0 d-flex flex-column align-items-center">
                          <a href="https://instagram.com/ppl.solutions" target="_blank" className="me-1">
                            <FaInstagram className="react-icons instagram-icon p-1" />
                          </a>
                          <p className="m-0">Instagram</p>
                        </div>
                      </Col>
                      <Col xs={4} md={3}>
                        <div className="m-0 d-flex flex-column align-items-center">
                          <a href="" target="_blank" className="me-1">
                            <FaTruck className="react-icons tmp-icon p-1" />
                          </a>
                          <p className="m-0">TruckersMP</p>
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-center column-gap-3 column-gap-md-4 mt-3 mt-md-4">
                      
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

