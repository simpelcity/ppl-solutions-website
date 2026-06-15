'use client'

import { useTheme } from 'next-themes'
import { Container, Image, Carousel } from 'react-bootstrap'
import { BSButton } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type Props = {
  dict: Dictionary;
  lang: Locale;
}

export default function HomeBanner({ dict, lang }: Props) {
  const { resolvedTheme } = useTheme();

  const currentLang = lang === 'en' ? '' : `/${lang}`;

  const carouselItems = [
    { href: `/assets/images/${resolvedTheme ? resolvedTheme : ''}/home-banner.jpg`, alt: dict.home.homeBannerAlt[resolvedTheme as 'light' | 'dark'] || dict.home.homeBannerAlt.default },
    { href: '/assets/images/gallery/lukas-scania.jpg', alt: 'Scania by Lukyy09' },
    { href: '/assets/images/gallery/maleklecocze-save-edit.png', alt: 'Save-edit by MaleklecoCZE' },
    { href: '/assets/images/gallery/simpelcity-daf.jpg', alt: 'DAF by Simpelcity' },
    { href: '/assets/images/gallery/simpelcity-maleklecocze-2.jpg', alt: "Scania's by Simpelcity" },
  ];

  return (
    <section className="d-flex w-100 text-light">
      <Container className="px-0 position-relative d-flex justify-content-center" fluid>
        <Carousel data-bs-theme="light" controls={false} fade className="w-100">
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <Image
                src={item.href}
                alt={item.alt}
                className="object-fit-cover w-100 home-img"
                fluid
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="z-1 position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
          <h4 className="text-center">"{dict.home.slogan}"</h4>
          <div className="mt-3 d-flex justify-content-center column-gap-3">
            <BSButton variant="outline" size="lg" border="light" href={`${currentLang}/apply`}>
              {dict.home.buttons.apply}
            </BSButton>
            <BSButton
              variant="outline"
              size="lg"
              border="light"
              href="https://discord.gg/mnKcKwsYm4"
              target="_blank">
              {dict.home.buttons.discord}
            </BSButton>
          </div>
        </div>
      </Container>
    </section>
  )
}
