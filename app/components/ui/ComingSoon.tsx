'use client'

import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { BSButton } from '@/components'
import { Alert, Card } from 'react-bootstrap'
import { useRouter } from 'next/navigation'

type Props = {
  dict: Dictionary;
  lang: Locale;
}

export default function ComingSoon({ dict, lang }: Props) {
  const router = useRouter();
  const canonical = lang === 'en' ? '' : `/${lang}`;

  return (
    <>
      <Card className="rounded-0 border-0 shadow-sm bg-dark text-light">
        <Card.Body className="p-4 text-center">
          <Card.Title className="fs-4 fw-bold">{dict.ComingSoon.title}</Card.Title>
          <Card.Text className="fs-5">{dict.ComingSoon.body}</Card.Text>
          <div className="d-flex justify-content-center column-gap-2">
            <BSButton variant="primary" onClick={() => router.back()}>{dict.ComingSoon.buttons.back}</BSButton>
            <BSButton variant="outline" href={`${canonical}/contact`}>{dict.ComingSoon.buttons.contact}</BSButton>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
