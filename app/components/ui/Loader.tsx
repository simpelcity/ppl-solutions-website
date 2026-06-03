import { Spinner } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
  children?: React.ReactNode;
  vh?: boolean;
}

export default function Loader({ dict, children, vh }: Props) {
  return (
    <div className="loader w-auto d-flex justify-content-center align-items-center text-theme p-0 fw-semibold" style={{ height: vh ? "100vh" : "auto" }}>
      <Spinner animation="border" className="me-2" />
      {children ? children : <span className="fs-4">{dict?.status.loading.loadingSpinner}</span>}
    </div>
  )
}
