import { StartBanner, GalleryGrid } from "@/components/"
import { Container } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  gallery: {
    meta: {
      title: string,
      description: string
    },
    title: string
  },
}

export default async function GalleryPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.gallery.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.gallery.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.gallery.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.gallery.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/gallery" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/gallery" />

      <main className="fs-5">
        <StartBanner>{dict.gallery.title}</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center">
          <Container className="d-flex justify-content-center my-5">
            <GalleryGrid />
          </Container>
        </section>
      </main>
    </>
  )
}

