import { Container, Row, Col } from "react-bootstrap";
import { ResetPasswordForm } from "@/components/";
import "@/styles/AuthCards.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/reset-password' : `/${lang}/reset-password`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.resetPassword.meta.title} | PPL Solutions`,
    description: dict.resetPassword.meta.description,
    openGraph: {
      title: `${dict.resetPassword.meta.title} | PPL Solutions`,
      description: dict.resetPassword.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/reset-password',
        'nl-NL': '/nl/reset-password',
        'cs-CZ': '/cs/reset-password',
        'sk-SK': '/sk/reset-password',
      },
    },
  }
}

export default function ResetPasswordPage({ params }: PageProps) {
  return (
    <>
      <main className="fs-5 main">
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 d-flex justify-content-center align-items-center">
              <Col xs={12} md={10} xl={4}>
                <ResetPasswordForm params={params} />
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}

