import { Dashboard } from '@/components'
import "@/styles/Drivershub.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"
import { CardProfile } from '@/components'

type PageProps = {
  params: Promise<{ lang: Locale; userId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/drivershub/profile' : `/${lang}/drivershub/profile`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `Profile | PPL Solutions`,
    description: dict.drivershub.meta.description,
    openGraph: {
      title: `Profile | PPL Solutions`,
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
        'en-US': '/drivershub/profile',
        'nl-NL': '/nl/drivershub/profile',
        'cs-CZ': '/cs/drivershub/profile',
        'sk-SK': '/sk/drivershub/profile',
      },
    },
  }
}

export default async function ProfileSettingsPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard dict={dict} lang={lang}>
            <CardProfile params={params} dict={dict} />
          </Dashboard>
        </section>
      </main>
    </>
  )
}
