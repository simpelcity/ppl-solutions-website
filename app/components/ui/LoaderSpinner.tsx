import { Spinner } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function LoaderSpinner({ dict }: Props) {
  return (
    <div className="loader w-auto d-flex justify-content-center align-items-center vh-100 text-light px-3">
      <Spinner animation="border" className="me-2" />
      <span className="fs-2">{dict.status.loading.loadingSpinner}</span>
    </div>
  )
}
