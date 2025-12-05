import Button from "react-bootstrap/Button"

interface ButtonSecondaryProps {
  children: React.ReactNode
  text?: string
  [key: string]: any
}

export default function ButtonSecondary({
  children,
  text = "light",
  border = "primary",
  classes,
  ...props
}: ButtonSecondaryProps) {
  return (
    <Button
      variant="secondary"
      className={`border border-2 border-${border} text-uppercase text-${text} fw-bold rounded-1 ${classes}`}
      {...props}>
      {children}
    </Button>
  )
}

