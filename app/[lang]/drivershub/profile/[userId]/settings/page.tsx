import "@/styles/Drivershub.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"
import { CardProfileSettingsForm } from '@/components'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from "next/navigation";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
          } catch (err: any) {
            console.error(err.message || err);
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

type PageProps = {
  params: Promise<{ lang: Locale; userId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const { userId } = await params
  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)

  const driverUsername = user?.user_metadata?.display_name || "Guest"

  const canonical = lang === 'en' ? '/drivershub/profile' : `/${lang}/drivershub/profile`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${driverUsername}'s Profile Settings | PPL Solutions`,
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
  const { lang, userId } = await params
  const dict = await getDictionary(lang)

  const user = await getSupabaseUser()
  console.log("Current user:", user);

  if (!user) {
    // Redirect to the current user's own settings page
    redirect(`/${lang}/drivershub/profile`);
  }

  if (user.id !== userId) {
    // Redirect to the current user's own settings page
    redirect(`/${lang}/drivershub/profile/${user.id}/settings`);
  }

  return (
    <>
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <CardProfileSettingsForm params={params} dict={dict} />
        </section>
      </main>
    </>
  )
}
