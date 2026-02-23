import { StartBanner, GalleryGrid } from "@/components/"
import { Container } from "react-bootstrap"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { type Metadata } from "next"

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const canonical = lang === 'en' ? '/gallery' : `/${lang}/gallery`;
  const locale = lang === 'en' ? 'en-US' : lang === 'cs' ? 'cs-CZ' : `${lang}-${lang.toUpperCase()}`;

  return {
    metadataBase: new URL('https://ppl-solutions.vercel.app'),
    title: `${dict.gallery.meta.title} | PPL Solutions`,
    description: dict.gallery.meta.description,
    openGraph: {
      title: `${dict.gallery.meta.title} | PPL Solutions`,
      description: dict.gallery.meta.description,
      url: canonical,
      siteName: 'PPL Solutions VTC',
      images: '/assets/images/ppls-logo.png',
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical,
      languages: {
        'en-US': '/gallery',
        'nl-NL': '/nl/gallery',
        'cs-CZ': '/cs/gallery',
        'sk-SK': '/sk/gallery',
      },
    },
  }
}

export default async function GalleryPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
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

