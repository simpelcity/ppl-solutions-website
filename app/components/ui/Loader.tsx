import { } from "react-bootstrap"
import type { Dictionary } from "@/app/i18n"

type Props = {
  children?: React.ReactNode;
  dict: Dictionary;
}

export default function Loader({ children, dict }: Props) {
  return (
    <div className="loader">
      <p className="text-light fw-bold">{dict.status.loading.loader}</p>
      <div className="words text-primary fw-bold text-start">{children}</div>
    </div>
  )
}

