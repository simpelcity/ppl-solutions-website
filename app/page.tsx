import { Container, Image, Row, Col } from "react-bootstrap"
import { ButtonOutline, CardText } from "@/components"
import "@/styles/Home.scss"

export default function HomePage() {
  return (
    <>
      <title>PPL Solutions | Steering the future of Digital Logistics</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="PPL Solutions | Steering the future of Digital Logistics" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <meta property="og:site_name" content="PPL Solutions VTC" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/" />
      <script src="https://kit.fontawesome.com/555ef81382.js" crossOrigin="anonymous"></script>

      <main className="fs-5">
        <section className="d-flex w-100 text-light">
          <Container className="px-0 position-relative d-flex justify-content-center" fluid>
            <Image
              src={"/assets/images/banner.jpg"}
              alt="PPL Solutions Scania S650 V8"
              className="object-fit-cover w-100 home-img"
              fluid
            />
            <div className="overlay position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
              <h4 className="text-center">"Steering the future of Digital Logistics"</h4>
              <div className="mt-3 d-flex justify-content-center column-gap-3">
                <ButtonOutline border="light" paddingx="20" paddingy="10" href="/apply">
                  apply
                </ButtonOutline>
                <ButtonOutline
                  border="light"
                  paddingx="20"
                  paddingy="10"
                  href="https://discord.gg/mnKcKwsYm4"
                  target="_blank">
                  discord
                </ButtonOutline>
              </div>
            </div>
          </Container>
        </section>
        <section className="short-about text-center text-light bg-dark-subtle d-flex justify-content-center">
          <Container className="my-5">
            <h1 className="text-uppercase">
              <span>about</span> <span className="text-primary">us</span>
            </h1>
            <p className="m-0">
              PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother.
            </p>
          </Container>
        </section>
        <section className="offers d-flex justify-content-center text-center bg-dark">
          <Container className="my-5 d-flex flex-column align-items-center">
            <h2 className="text-uppercase mb-3 text-light mb-4">
              <span>what do we</span> <span className="text-primary">offer</span> <span>?</span>
            </h2>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <Col xs={12} md={6} xl={4}>
                <CardText title="friendly staff" icon="FaUsers">
                  We have a small but extremely friendly staff team that can help you with any problem you might face
                  while driving for us.
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title="save-edits" icon="FaEdit">
                  Our drivers have access to a wide variety of custom-made save-edits, including full-sets of trucks,
                  custom parts, and much more.
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title="custom mods" icon="FaGears">
                  We also offer some exclusive PPL Solutions mods to use while playing singleplayer or convoys mode.
                </CardText>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="apply-today d-flex justify-conetent-center text-center bg-dark-subtle text-light">
          <Container className="my-5">
            <h2 className="text-uppercase">
              <span>apply</span> <span className="text-primary">today</span>
            </h2>
            <p>Apply through our discord server today, and start your amazing journey with PPL Solutions.</p>
            <div className="d-grid d-md-inline-block">
              <ButtonOutline border="primary" text="primary">
                apply now
              </ButtonOutline>
            </div>
          </Container>
        </section>
      </main>
    </>
  )
}

