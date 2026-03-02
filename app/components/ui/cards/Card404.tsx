"use client"

import { usePathname } from 'next/navigation'
import { Card, CardBody, Row, Col } from 'react-bootstrap'
import { FaRegFaceFrown } from "react-icons/fa6";

const locales = ['en', 'nl', 'cs', 'sk'] as const
type Locale = (typeof locales)[number]

const messages: Record<Locale, { intro: string; title: string }> = {
  en: { intro: 'Uh, oh', title: 'Page not found' },
  nl: { intro: 'Oeps', title: 'Pagina niet gevonden' },
  cs: { intro: 'Jejda', title: 'Stránka nebyla nalezena' },
  sk: { intro: 'Ups', title: 'Stránka nebola nájdená' },
}

function getLocaleFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  if (!firstSegment) return null
  return locales.includes(firstSegment as Locale) ? (firstSegment as Locale) : null
}

function getMessageLocale(pathname: string): Locale {
  const localeFromPath = getLocaleFromPath(pathname)
  return localeFromPath ?? 'en'
}

export default function Card404() {
  const pathname = usePathname()
  const locale = getMessageLocale(pathname)
  const message = messages[locale]

  return (
    <Card className="404-card rounded-0 border-0 shadow">
      <CardBody className="p-4">
        <Row className="w-100">
          <Col xs={12} md={6} className="">
            <FaRegFaceFrown size={130} />
          </Col>
          <Col xs={12} md={6} className="">
            <h1 className="">Oops, page not found</h1>
            <p className="">The page you are looking for does not exist.</p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
