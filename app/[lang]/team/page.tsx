import { StartBanner, TeamGrid } from "@/components/"
import { Container } from "react-bootstrap"
import "@/styles/roles.scss"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

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

export default async function TeamPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.team.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.team.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.team.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.team.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/team" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/team" />

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

