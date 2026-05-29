'use client'

import { Container, Image } from "react-bootstrap";
import { useTheme } from 'next-themes'
import type { Dictionary } from "@/app/i18n"

type Props = {
  children: React.ReactNode;
  dict: Dictionary;
}

export default function StartBanner({ children, dict }: Props) {
  const { resolvedTheme } = useTheme();
  return (
    <section className="d-flex w-100 text-light">
      <Container className="px-0 position-relative d-flex justify-content-center" fluid>
        <Image
          src={`/assets/images/${resolvedTheme ? resolvedTheme : ''}/start-banner.jpg`}
          alt={dict.startBannerAlt[resolvedTheme as 'light' | 'dark'] || dict.startBannerAlt.light}
          className="banner-img w-100 object-fit-cover"
        />
        <div className="start-banneroverlay position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
          <h1 className="text-uppercase">{children}</h1>
        </div>
      </Container>
    </section>
  );
}
