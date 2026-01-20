import { CardTeamForm, Dashboard } from "@/components/"
import { Row, Col } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import "@/styles/Drivershub.scss"
import "@/styles/roles.scss"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export default async function DashboardTeamPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <title>{`${dict.drivershub.team.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.drivershub.team.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.drivershub.team.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.drivershub.team.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/drivershub/dashboard" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/drivershub/dashboard" />

      <main className="fs-5">
        <section className="drivershub w-100 d-flex justify-content-center bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <Row className="w-100 justify-content-center">
              <CardTeamForm dict={dict.drivershub.team} />
            </Row>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

