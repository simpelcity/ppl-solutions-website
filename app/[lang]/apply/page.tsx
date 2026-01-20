import { Container, Card, CardBody, CardTitle, Row, Col } from "react-bootstrap"
import { StartBanner } from "@/components/"
import { FaDiscord, FaTiktok, FaTruck } from "react-icons/fa"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

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
      description: string
    }
  },
}

export default async function ApplyPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  const split = dict.apply.card.description.split(" ");
  const apply1 = split.slice(0, split.indexOf("Discord")).join(" ") + " ";
  const apply2 = dict.apply.card.description.match(/\bDiscord\b/);
  const start = dict.apply.card.description.indexOf("Discord");
  const apply3 = dict.apply.card.description.slice(start + "Discord".length);

  return (
    <>
      <title>{`${dict.apply.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.apply.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.apply.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.apply.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/apply" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/apply" />

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

