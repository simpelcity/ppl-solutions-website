import { StartBanner, DivTeam, CardTeam } from "@/components"
import { Container, Row } from "react-bootstrap"
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
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <DivTeam team={"Management"}>
                <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"founder"}>
                  Founder
                </CardTeam>
                <CardTeam img={"maleklecocze.png"} member={"MaleklecoCZE"} role={"ceo"}>
                  Chief Executive Officer
                </CardTeam>
                <CardTeam img={"martas18.png"} member={"Martas18"} role={"coo"}>
                  Chief Operating Officer
                </CardTeam>
              </DivTeam>
            </Row>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <DivTeam team={"Human Resources"}>
                <CardTeam img={"maleklecocze.png"} member={"MaleklecoCZE"} role={"hrd"}>
                  Human Resources Director
                </CardTeam>
                <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"hr"}>
                  Human Resources
                </CardTeam>
              </DivTeam>
            </Row>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <DivTeam team={"Recruitment Team"}>
                <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"rtd"}>
                  Recruitment Team Director
                </CardTeam>
              </DivTeam>
            </Row>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <DivTeam team={"Event Team"}>
                <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"etm"}>
                  Event Team Manager
                </CardTeam>
                <CardTeam img={"lukyy09.png"} member={"Lukyy09"} role={"et"}>
                  Event Team
                </CardTeam>
              </DivTeam>
            </Row>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <DivTeam team={"Media Team"}>
                <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"mtm"}>
                  Media Team Manager
                </CardTeam>
                <CardTeam img={"lukyy09.png"} member={"Lukyy09"} role={"mt"}>
                  Media Team
                </CardTeam>
              </DivTeam>
            </Row>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <DivTeam team={"Convoy Control"}>
                <CardTeam img={"martas18.png"} member={"Martas18"} role={"ccm"}>
                  Convoy Control Manager
                </CardTeam>
              </DivTeam>
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

