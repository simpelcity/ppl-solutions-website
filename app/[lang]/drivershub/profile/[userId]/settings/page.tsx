import { Dashboard, BSButton } from '@/components'
import "@/styles/Drivershub.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import CardProfileSettingsForm from '@/components/ui/cards/CardProfileSettingsForm'

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

  // const { userId } = await params;
  // console.log(userId)

  // // UUID v4 regex
  // const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  // if (!uuidV4Regex.test(userId)) {
  //   return <h1>Not found!</h1>;
  // }

  // const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  // console.log(data)
  // if (error || !data?.user) {
  //   return <h1>Not found</h1>;
  // }

  // await supabaseAdmin.auth.admin.updateUserById(userId, {
  //   user_metadata: { display_name: 'new_display_namee' }
  // });

  return (
    <>
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard dict={dict} lang={lang}>
            <CardProfileSettingsForm params={params} />
          </Dashboard>
        </section>
      </main>
    </>
  )
}
