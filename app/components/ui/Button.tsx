import Button from "react-bootstrap/Button";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  border?: string;
  text?: string;
  classes?: string;
  [key: string]: any;
}

export default function BSButton({
  children,
  border,
  text = "light",
  classes,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: { padding: "3px 6px" },
    md: { padding: "6px 12px" },
    lg: { padding: "10px 20px" },
  };

  return (
    <Button
      variant={variant}
      className={`border ${border
        ?.split(" ")
        .map((b) => `border-${b}`)
        .join(" ")} text-uppercase text-${text} fw-bold rounded-1 ${classes}`}
      style={sizeStyles[size]}
      {...props}>
      {children}
    </Button>
  );
}

