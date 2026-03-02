import { Card, CardBody, Row, Col } from 'react-bootstrap'
import { FaRegFaceFrown } from "react-icons/fa6";
import { BSButton } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { i18n, type Locale } from "@/i18n"

type Card404Props = {
  dict: Dictionary
  lang: Locale
}

export default function Card404({ dict, lang }: Card404Props) {
  const homeHref = lang === i18n.defaultLocale ? "/" : `/${lang}`
  const contactHref = lang === i18n.defaultLocale ? "/contact" : `/${lang}/contact`

  return (
    <Card className="card-404 rounded-0 border-0 shadow text-light">
      <CardBody className="p-4 d-flex justify-content-center">
        <Row className="w-100">
          <Col xs={12} md={5} className="d-flex justify-content-center align-items-center">
            <FaRegFaceFrown size={150} />
          </Col>
          <Col xs={12} md={7} className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start">
            <h1 className="">{dict["not-found"].card.title}</h1>
            <p className="">{dict["not-found"].card.text}</p>
            <div className="d-flex column-gap-2">
              <BSButton variant="primary" href={homeHref}>home</BSButton>
              <BSButton variant="outline" href={contactHref}>contact us</BSButton>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
