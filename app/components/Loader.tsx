import {} from "react-bootstrap"

export default function Loader({ children }: { children?: React.ReactNode }) {
  return (
    <div className="loader">
      <p className="text-light fw-bold">loading</p>
      <div className="words text-primary fw-bold text-start">{children}</div>
    </div>
  )
}

