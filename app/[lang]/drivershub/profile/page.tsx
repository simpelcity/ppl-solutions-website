import { Dashboard } from "@/components/"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/Drivershub.scss"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <title>Profile | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Profile | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/drivershub/profile" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/drivershub/profile" />

      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <h1>Profile</h1>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

