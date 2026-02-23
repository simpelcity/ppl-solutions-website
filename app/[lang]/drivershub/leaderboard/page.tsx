import { Dashboard } from "@/components/"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/Drivershub.scss"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/drivershub/leaderboard' : `/${lang}/drivershub/leaderboard`;
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
        'en-US': '/drivershub/leaderboard',
        'nl-NL': '/nl/drivershub/leaderboard',
        'cs-CZ': '/cs/drivershub/leaderboard',
        'sk-SK': '/sk/drivershub/leaderboard',
      },
    },
  }
}

export default async function LeaderboardPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <h1>Leaderboard</h1>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

