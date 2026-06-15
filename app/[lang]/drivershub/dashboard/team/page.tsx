import { CardTeamForm } from "@/components"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/ui/Roles.scss"
import { type Metadata } from "next"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/drivershub/dashboard/team' : `/${lang}/drivershub/dashboard/team`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.drivershub.dashboard.team.meta.title} | PPL Solutions VTC`,
    description: dict.drivershub.dashboard.team.meta.description,
    openGraph: {
      title: `${dict.drivershub.dashboard.team.meta.title} | PPL Solutions VTC`,
      description: dict.drivershub.dashboard.team.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/drivershub/dashboard/team',
        'nl-NL': '/nl/drivershub/dashboard/team',
        'cs-CZ': '/cs/drivershub/dashboard/team',
        'sk-SK': '/sk/drivershub/dashboard/team',
      },
    },
  }
}

export default async function DashboardTeamPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <section className="drivershub w-100 d-flex justify-content-center bg-surface-darker text-center text-theme">
          <CardTeamForm dict={dict} lang={lang} />
        </section>
      </main>
    </>
  )
}

