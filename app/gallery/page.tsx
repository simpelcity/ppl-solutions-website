import { StartBanner, GalleryGrid } from "@/components/"
import { Container } from "react-bootstrap"

export default function GalleryPage() {
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
            <GalleryGrid />
          </Container>
        </section>
      </main>
    </>
  )
}

