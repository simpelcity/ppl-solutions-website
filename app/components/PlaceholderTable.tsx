// app/components/PlaceholderTable.tsx
import Placeholder from "react-bootstrap/Placeholder"

interface PlaceholderTableProps {
  columns?: number
  rows?: number
}

export default function PlaceholderTable({ columns = 8, rows = 5 }: PlaceholderTableProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((__, c) => (
            <td key={c} className="py-2">
              <Placeholder as="span" animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

