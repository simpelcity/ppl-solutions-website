import { Container, Image, Row, Col } from "react-bootstrap";
import { CardText, BSButton, HomeBanner } from "@/components";
import "@/styles/pages/Home.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/' : `/${lang}`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `PPL Solutions VTC | ${dict.home.meta.title}`,
    description: dict.home.meta.description,
    openGraph: {
      title: `PPL Solutions VTC | ${dict.home.meta.title}`,
      description: dict.home.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/',
        'nl-NL': '/nl',
        'cs-CZ': '/cs',
        'sk-SK': '/sk',
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const currentLang = lang === 'en' ? '' : `/${lang}`;

  const aboutUs1 = dict.home.aboutUs.title.split(' ')[0];
  const aboutUs2 = dict.home.aboutUs.title.split(' ')[1];

  const splitLastWord = (text: string) => {
    const words = text.trim().split(/\s+/);
    const lastSplit = words.pop() ?? '';
    const last = lastSplit.endsWith('?') ? lastSplit.slice(0, -1) : lastSplit;
    return {
      normal: words.join(' '),
      primary: last,
    };
  };

  const { normal, primary } = splitLastWord(dict.home.offers.title);

  const apply1 = dict.home.apply.title.split(' ')[0];
  const apply2 = dict.home.apply.title.split(' ')[1];
  const apply3 = dict.home.apply.title.split(' ')[2];

  return (
    <>
      <main className="fs-5">
        <HomeBanner dict={dict} lang={lang} />
        <section className="short-about text-center d-flex justify-content-center bg-surface-darker text-theme">
          <Container className="p-3 p-md-4">
            <h1 className="text-uppercase">
              <span>{aboutUs1}</span> <span className="text-primary">{aboutUs2}</span>
            </h1>
            <p className="m-0">
              {dict.home.aboutUs.text}
            </p>
          </Container>
        </section>
        <section className="offers d-flex justify-content-center text-center bg-surface text-theme">
          <Container className="p-3 p-md-4 d-flex flex-column align-items-center">
            <h2 className="text-uppercase mb-3 mb-md-4">
              <span>{normal}</span>{" "}
              <span className="text-primary">{primary}</span> ?
            </h2>
            <Row className="d-flex justify-content-center row-gap-3 row-gap-md-4">
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card1.title} icon="FaUsers">
                  {dict.home.offers.card1.text}
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card2.title} icon="FaEdit">
                  {dict.home.offers.card2.text}
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card3.title} icon="FaGears">
                  {dict.home.offers.card3.text}
                </CardText>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="apply-today d-flex justify-content-center text-center bg-surface-darker">
          <Container className="p-3 p-md-4">
            <h2 className="text-uppercase">
              <span>{apply1}</span> <span className="text-primary">{apply2} {apply3}</span>
            </h2>
            <p>{dict.home.apply.text}</p>
            <div className="">
              <BSButton variant="outline" border="primary" text="primary" href={`${currentLang}/apply`}>
                {dict.home.apply.button}
              </BSButton>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

