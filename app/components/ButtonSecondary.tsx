import Button from "react-bootstrap/Button";

interface ButtonSecondaryProps {
  children: React.ReactNode;
  text?: string;
  [key: string]: any;
}

export default function ButtonSecondary({ children, text = "light", ...props }: ButtonSecondaryProps) {
  return (
    <Button
      variant="secondary"
      className={`border border-2 border-primary text-uppercase text-${text} fw-bold rounded-1`}
      {...props}>
      {children}
    </Button>
  );
}
