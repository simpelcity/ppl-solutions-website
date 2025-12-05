import Button from "react-bootstrap/Button"

interface ButtonPrimaryProps {
  children: React.ReactNode
  text?: string
  [key: string]: any
}

export default function ButtonPrimary({
  children,
  text = "light",
  border = "primary",
  classes,
  ...props
}: ButtonPrimaryProps) {
  return (
    <Button
      variant="primary"
      className={`border border-2 border-${border} text-uppercase text-${text} fw-bold rounded-1 ${classes}`}
      {...props}>
      {children}
    </Button>
  )
}

