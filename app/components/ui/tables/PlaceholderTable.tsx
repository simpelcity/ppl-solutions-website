import Placeholder from "react-bootstrap/Placeholder"
import Table from "react-bootstrap/Table"

interface PlaceholderTableProps {
  columns?: number
  rows?: number
}

const tableItems = [
  { title: "date" },
  { title: "username" },
  { title: "game" },
  { title: "from - to" },
  { title: "cargo" },
  { title: "truck" },
  { title: "distance" },
  { title: "income" },
]

export default function PlaceholderTable({ columns = 8, rows = 5 }: PlaceholderTableProps) {
  return (
    <>
      <Table variant="dark" className="table-nowrap table-minwidth text-start" borderless>
        <thead className="">
          <tr className="text-uppercase">
            {tableItems.map((item) => (
              <th key={item.title} className="bg-primary px-4 py-2">
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </Table>
    </>
  )
}

