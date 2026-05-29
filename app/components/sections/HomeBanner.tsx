'use client'

import { useTheme } from 'next-themes'
import { Container, Image } from 'react-bootstrap'
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

  return (
    <section className="d-flex w-100 text-light">
      <Container className="px-0 position-relative d-flex justify-content-center" fluid>
        <Image
          src={`/assets/images/${resolvedTheme ? resolvedTheme : ''}/home-banner.jpg`}
          alt={dict.home.homeBannerAlt[resolvedTheme as 'light' | 'dark'] || dict.home.homeBannerAlt.default}
          className="object-fit-cover w-100 home-img"
          fluid
        />
        <div className=" position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
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
