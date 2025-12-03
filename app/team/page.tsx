import { StartBanner, DivTeam, CardTeam } from "@/components";
import { Container } from "react-bootstrap";
import "@/styles/roles.scss";

export default function TeamPage() {
  return (
    <>
      <main className="fs-5">
        <StartBanner>team</StartBanner>
        <section className="team d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex flex-column mt-4 mb-5">
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
            <DivTeam team={"Human Resources"}>
              <CardTeam img={"maleklecocze.png"} member={"MaleklecoCZE"} role={"hrd"}>
                Human Resources Director
              </CardTeam>
              <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"hr"}>
                Human Resources
              </CardTeam>
            </DivTeam>
            <DivTeam team={"Recruitment Team"}>
              <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"rtd"}>
                Recruitment Team Director
              </CardTeam>
            </DivTeam>
            <DivTeam team={"Event Team"}>
              <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"etm"}>
                Event Team Manager
              </CardTeam>
              <CardTeam img={"lukyy09.png"} member={"Lukyy09"} role={"et"}>
                Event Team
              </CardTeam>
            </DivTeam>
            <DivTeam team={"Media Team"}>
              <CardTeam img={"simpelcity.jpg"} member={"Simpelcity"} role={"mtm"}>
                Media Team Manager
              </CardTeam>
              <CardTeam img={"lukyy09.png"} member={"Lukyy09"} role={"mt"}>
                Media Team
              </CardTeam>
            </DivTeam>
            <DivTeam team={"Convoy Control"}>
              <CardTeam img={"martas18.png"} member={"Martas18"} role={"ccm"}>
                Convoy Control Manager
              </CardTeam>
            </DivTeam>
          </Container>
        </section>
      </main>
    </>
  );
}
