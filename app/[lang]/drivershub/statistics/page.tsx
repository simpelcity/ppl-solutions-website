import { Dashboard, UserStats } from "@/components/"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/Drivershub.scss"
import { type Metadata } from "next"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type Props = {
  params: Promise<{ lang: Locale }>
}

async function getSupabaseUser() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            console.log('error')
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const user = await getSupabaseUser()

  const driverUsername = user?.user_metadata?.username || user?.email || "Guest"
  const split = dict.drivershub.userStats.meta.title.split(' ');
  const splitDesc = dict.drivershub.userStats.meta.description.split(' ');
  console.log(splitDesc);

  let titleText = '';
  let descriptionText = '';
  if (lang === 'en') {
    titleText = `${driverUsername}${dict.drivershub.userStats.meta.title}`;
  } else if (lang === 'nl') {
    titleText = `${driverUsername}${dict.drivershub.userStats.meta.title}`;
  } else if (lang === 'cs') {
    titleText = `${split[0]} ${driverUsername}`;
    descriptionText = `${splitDesc[0]} ${driverUsername} ${splitDesc.slice(2).join(' ')}`;
  } else if (lang === 'sk') {
    titleText = `${split[0]} ${driverUsername}`;
    descriptionText = `${splitDesc[0]} ${driverUsername} ${splitDesc.slice(2).join(' ')}`;
  }

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: titleText + " | PPL Solutions" || dict.drivershub.userStats.meta.title,
    description: descriptionText || dict.drivershub.userStats.meta.description,
    openGraph: {
      type: "website",
      title: titleText + " | PPL Solutions" || dict.drivershub.userStats.meta.title,
      description: descriptionText || dict.drivershub.userStats.meta.description,
      url: "/drivershub/statistics",
      images: "/assets/images/ppls-logo.png"
    },
    alternates: {
      canonical: "/drivershub/statistics",
      languages: {
        'en-US': '/en/drivershub/statistics',
        'nl-NL': '/nl/drivershub/statistics',
        'cz-CZ': '/cz/drivershub/statistics',
        'sk-SK': '/sk/drivershub/statistics',
      },
    }
  }
}

export default async function StatisticsPage({ params }: Props) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main className="fs-5">
      <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
        <Dashboard dict={dict.drivershub.sidebar}>
          <UserStats />
        </Dashboard>
      </section>
    </main>
  )
}
