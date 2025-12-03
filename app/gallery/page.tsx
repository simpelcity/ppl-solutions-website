import { StartBanner, CardGallery } from "@/components";
import { Container, Row, Col } from "react-bootstrap";

export default function GalleryPage() {
  const galleryItems = [
    { src: "lukas-scania.jpg", title: "Scania by Lukyy09" },
    { src: "simpelcity-daf.jpg", title: "DAF by Simpelcity" },
    { src: "maleklecocze-save-edit.png", title: "Save-edit by MaleklecoCZE" },
    { src: "simpelcity-maleklecocze-2.jpg", title: "Scania's by Simpelcity" },
    { src: "simpelcity-maleklecocze.png", title: "Scania's by MaleklecoCZE" },
    { src: "xx-shadowdagger2013-xx-truck.png", title: "Truck by xX_shadowdagger2013_Xx" },
  ];

  return (
    <>
      <main className="fs-5">
        <StartBanner>gallery</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="my-5">
            <Row className="w-100 row-gap-4 d-flex justify-content-center">
              {galleryItems.map((item) => (
                <Col xs={12} md={6} xl={3} className="">
                  <CardGallery key={item.src} img={item.src} title={item.title} />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}
