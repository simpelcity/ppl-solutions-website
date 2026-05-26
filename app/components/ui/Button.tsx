import Button from "react-bootstrap/Button";

type ButtonVariant = "primary" | "secondary" | "outline" | "transparent";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "primary-btn",
  secondary: "secondary-btn",
  outline: "outline-btn",
  transparent: "transparent-btn",
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "0.25rem 0.5rem", fontSize: "0.875rem" },
  md: { padding: "0.5rem 1rem", fontSize: "1rem" },
  lg: { padding: "0.5rem 1rem" },
};

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  border?: string;
  text?: string;
  classes?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function BSButton({
  children,
  border = "primary",
  text = "light",
  classes,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <Button
      variant={variant}
      className={`border ${border
        ?.split(" ")
        .map((b) => `border-${b}`)
        .join(" ")} text-uppercase text-${text} fw-bold rounded-1 ${classes} ${variantStyles[variant]}`}
      style={sizeStyles[size]}
      {...props}>
      {children}
    </Button>
  );
}

