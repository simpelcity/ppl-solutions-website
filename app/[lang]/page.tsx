import { Container, Image, Row, Col } from "react-bootstrap";
import { CardText, BSButton } from "@/components/index";
import "@/styles/Home.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `PPL Solutions | ${dict.home.meta.title}`,
    description: dict.home.meta.description,
    openGraph: {
      type: 'website',
      title: `PPL Solutions | ${dict.home.meta.title}`,
      description: dict.home.meta.description,
      url: '/',
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
    },
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en',
        'nl-NL': '/nl',
        'cz-CZ': '/cz',
        'sk-SK': '/sk',
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const aboutUs1 = dict.home["about-us"].title.split(' ')[0];
  const aboutUs2 = dict.home["about-us"].title.split(' ')[1];

  const offer1 = dict.home.offers.title.split(' ')[0];
  const offer2 = dict.home.offers.title.split(' ')[1];
  const offer3 = dict.home.offers.title.split(' ')[2];

  const apply1 = dict.home.apply.title.split(' ')[0];
  const apply2 = dict.home.apply.title.split(' ')[1];
  const apply3 = dict.home.apply.title.split(' ')[2];

  return (
    <>
      <script src="https://kit.fontawesome.com/555ef81382.js" crossOrigin="anonymous"></script>

      <main className="fs-5">
        <section className="d-flex w-100 text-light">
          <Container className="px-0 position-relative d-flex justify-content-center" fluid>
            <Image
              src={"/assets/images/banner.jpg"}
              alt="PPL Solutions Scania S650 V8"
              className="object-fit-cover w-100 home-img"
              fluid
            />
            <div className="overlay position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
              <h4 className="text-center">"{dict.home.slogan}"</h4>
              <div className="mt-3 d-flex justify-content-center column-gap-3">
                <BSButton variant="outline" size="lg" border="light" href="/apply">
                  {dict.home.buttons.apply}
                </BSButton>
                <BSButton
                  variant="outline"
                  size="lg"
                  border="light"
                  href="https://discord.gg/mnKcKwsYm4"
                  target="_blank">
                  {dict.home.buttons.discord}
                </BSButton>
              </div>
            </div>
          </Container>
        </section>
        <section className="short-about text-center text-light bg-dark-subtle d-flex justify-content-center">
          <Container className="my-5">
            <h1 className="text-uppercase">
              <span>{aboutUs1}</span> <span className="text-primary">{aboutUs2}</span>
            </h1>
            <p className="m-0">
              {dict.home["about-us"].description}
            </p>
          </Container>
        </section>
        <section className="offers d-flex justify-content-center text-center bg-dark">
          <Container className="my-5 d-flex flex-column align-items-center">
            <h2 className="text-uppercase mb-3 text-light mb-4">
              <span>{offer1}</span> <span className="text-primary">{offer2}</span> <span>{offer3}?</span>
            </h2>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.title} icon="FaUsers">
                  {dict.home.offers.card1.description}
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card2.title} icon="FaEdit">
                  {dict.home.offers.card2.description}
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card3.title} icon="FaGears">
                  {dict.home.offers.card3.description}
                </CardText>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="apply-today d-flex justify-conetent-center text-center bg-dark-subtle text-light">
          <Container className="my-5">
            <h2 className="text-uppercase">
              <span>{apply1}</span> <span className="text-primary">{apply2} {apply3}</span>
            </h2>
            <p>{dict.home.apply.description}</p>
            <div className="d-grid d-md-inline-block">
              <BSButton variant="outline" border="primary" text="primary">
                {dict.home.apply.button}
              </BSButton>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

