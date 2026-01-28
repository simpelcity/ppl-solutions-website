import { Container, Card, CardBody, CardTitle, Row, Col } from "react-bootstrap"
import { StartBanner } from "@/components/"
import { FaDiscord, FaTiktok, FaTruck } from "react-icons/fa"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  apply: {
    meta: {
      title: string,
      description: string
    },
    title: string,
    card: {
      text: string
    }
  },
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
  const dict = await getDictionary(lang) as DictionaryType

  const split = dict.apply.card.text.split(" ");
  const apply1 = split.slice(0, split.indexOf("Discord")).join(" ") + " ";
  const apply2 = dict.apply.card.text.match(/\bDiscord\b/);
  const start = dict.apply.card.text.indexOf("Discord");
  const apply3 = dict.apply.card.text.slice(start + "Discord".length);

  return (
    <>
      <main className="fs-5">
        <StartBanner>{dict.apply.title}</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="my-5 d-flex justify-content-center">
            <Row className="w-100 d-flex justify-content-center">
              <Col xs={12} md={10} xl={7}>
                <Card className="bg-dark text-light">
                  <CardBody>
                    <CardTitle>
                      {apply1}
                      <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="text-decoration-none fw-bold">
                        {apply2}
                      </a>{" "}
                      {apply3}
                    </CardTitle>
                    <div className="d-flex justify-content-center mt-4">
                      <div className="m-3 mt-0 d-flex flex-column align-items-center">
                        <a href="https://discord.gg/mnKcKwsYm4" target="_blank" className="me-1">
                          <FaDiscord className="react-icons discord-icon p-1" />
                        </a>
                        <p className="m-0">Discord</p>
                      </div>
                      <div className="m-3 mt-0 d-flex flex-column align-items-center">
                        <a href="" target="_blank" className="me-1">
                          <FaTiktok className="react-icons tiktok-icon p-1" />
                        </a>
                        <p className="m-0">TikTok</p>
                      </div>
                      <div className="m-3 mt-0 d-flex flex-column align-items-center">
                        <a href="" target="_blank" className="me-1">
                          <FaTruck className="react-icons tmp-icon p-1" />
                        </a>
                        <p className="m-0">TruckersMP</p>
                      </div>
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

