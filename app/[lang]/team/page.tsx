import { StartBanner, TeamGrid } from "@/components/"
import { Container } from "react-bootstrap"
import "@/styles/roles.scss"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  team: {
    meta: {
      title: string;
      description: string;
    };
    title: string;
    loading: string;
    error: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/team' : `/${lang}/team`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.team.meta.title} | PPL Solutions`,
    description: dict.team.meta.description,
    openGraph: {
      title: `${dict.team.meta.title} | PPL Solutions`,
      description: dict.team.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/team',
        'nl-NL': '/nl/team',
        'cs-CZ': '/cs/team',
        'sk-SK': '/sk/team',
      },
    },
  }
}

export default async function TeamPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <main className="fs-5">
        <StartBanner>{dict.team.title}</StartBanner>
        <section className="team d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex flex-column align-items-center mt-4 mb-5">
            <TeamGrid lang={lang} teamDict={dict.team} />
          </Container>
        </section>
      </main>
    </>
  )
}

