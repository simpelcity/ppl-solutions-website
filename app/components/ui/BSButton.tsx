import Button from "react-bootstrap/Button";
import "@/styles/ui/BSButton.scss"

type ButtonVariant = "primary" | "secondary" | "outline" | "transparent";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  transparent: "btn-transparent",
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
  const borderClasses = border
    ?.split(" ")
    .filter(Boolean)
    .map((b) => `border-${b}`)
    .join(" ");

  const optionalClasses = [borderClasses, classes].filter(Boolean).join(" ");

  return (
    <Button
      variant={variant}
      className={`${variantStyles[variant]} border text-uppercase fw-bold rounded-1 text-${text}${optionalClasses ? ` ${optionalClasses}` : ''}`}
      style={sizeStyles[size]}
      {...props}>
      {children}
    </Button>
  );
}

