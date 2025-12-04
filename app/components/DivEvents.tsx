interface DivEventsProps {
  children: React.ReactNode
}

export default function DivEvents({ children }: DivEventsProps) {
  return <div className="mb-3 fs-5 d-flex flex-column align-items-start">{children}</div>
}

