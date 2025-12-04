import Button from "react-bootstrap/Button"

interface ButtonOutlineProps {
  children: React.ReactNode
  text?: string
  [key: string]: any
}

export default function ButtonOutline({
  children,
  border = "primary",
  paddingx,
  paddingy,
  text = "light",
  width,
  classes,
  ...props
}: ButtonOutlineProps) {
  return (
    <Button
      variant="transparent"
      className={`border border-${width} border-${border} text-uppercase text-${text} fw-bold rounded-1 btn-outline-${border} ${classes}`}
      style={{ padding: `${paddingy}px ${paddingx}px` }}
      {...props}>
      {children}
    </Button>
  )
}

