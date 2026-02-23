import { Card, CardBody, CardTitle } from "react-bootstrap";
import { TableJobs, Dashboard } from "@/components/";
import "@/styles/Drivershub.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/drivershub' : `/${lang}/drivershub`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.drivershub.meta.title} | PPL Solutions`,
    description: dict.drivershub.meta.description,
    openGraph: {
      title: `${dict.drivershub.meta.title} | PPL Solutions`,
      description: dict.drivershub.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/drivershub',
        'nl-NL': '/nl/drivershub',
        'cs-CZ': '/cs/drivershub',
        'sk-SK': '/sk/drivershub',
      },
    },
  }
}

export default async function DriversHubPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <Card className="bg-dark rounded-0 border-0 shadow mt-3">
              <CardBody className="p-4">
                <CardTitle className="text-uppercase fs-2 text-light mb-3">{dict.drivershub.jobs.title}</CardTitle>
                <TableJobs params={params} />
              </CardBody>
            </Card>
          </Dashboard>
        </section>
      </main>
    </>
  );
}

