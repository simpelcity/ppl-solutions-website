import { StartBanner, DivTeam, CardTeam } from "@/components"
import { Container, Row } from "react-bootstrap"
import TeamGrid from "@/components/TeamGrid"
import "@/styles/roles.scss"

export default function TeamPage() {
  return (
    <>
      <title>Team | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Team | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/team" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/team" />

      <main className="fs-5">
        <StartBanner>team</StartBanner>
        <section className="team d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex flex-column align-items-center mt-4 mb-5">
            <TeamGrid />
          </Container>
        </section>
      </main>
    </>
  )
}

