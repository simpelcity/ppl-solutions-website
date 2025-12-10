import { StartBanner, CardGallery } from "@/components"
import { Container, Row, Col } from "react-bootstrap"

export default function GalleryPage() {
  const galleryItems = [
    { src: "lukas-scania.jpg", title: "Scania by Lukyy09" },
    { src: "simpelcity-daf.jpg", title: "DAF by Simpelcity" },
    { src: "maleklecocze-save-edit.png", title: "Save-edit by MaleklecoCZE" },
    { src: "simpelcity-maleklecocze-2.jpg", title: "Scania's by Simpelcity" },
    { src: "simpelcity-maleklecocze.png", title: "Scania's by MaleklecoCZE" },
    { src: "xx-shadowdagger2013-xx-truck.png", title: "Truck by xX_shadowdagger2013_Xx" },
  ]

  return (
    <>
      <title>Gallery | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Gallery | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/gallery" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/gallery" />

      <main className="fs-5">
        <StartBanner>gallery</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <Row className="w-100 row-gap-4 d-flex justify-content-center">
              {galleryItems.map((item) => (
                <Col xs={12} md={6} xl={3} key={item.title}>
                  <CardGallery img={item.src} title={item.title} />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </main>
    </>
  )
}

