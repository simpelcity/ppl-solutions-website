import { Spinner } from 'react-bootstrap'

export default function LoaderSpinner() {
  return (
    <div className="loader w-auto d-flex justify-content-center align-items-center vh-100 text-light px-3">
      <Spinner animation="border" className="me-2" />
      <span className="fs-2">Loading...</span>
    </div>
  )
}
