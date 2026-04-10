import { Spinner } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
  children?: React.ReactNode;
}

export default function LoaderSpinner({ dict, children }: Props) {
  return (
    <div className="loader w-auto d-flex justify-content-center align-items-center vh-100 text-light p-0">
      <Spinner animation="border" className="me-2" />
      {children ? children : <span>{dict?.status.loading.loadingSpinner}</span>}
    </div>
  )
}
