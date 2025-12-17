import Card from "react-bootstrap/Card";

interface CardProps {
  children: React.ReactNode;
  border?: string;
  text?: string;
  classes?: string;
  [key: string]: any;
}

export default function BSCard({ children, border, text = "light", classes, size = "md", ...props }: CardProps) {
  return (
    <Card
      className={`border ${border
        ?.split(" ")
        .map((b) => `border-${b}`)
        .join(" ")} text-uppercase text-${text} fw-bold rounded-1 ${classes}`}>
      {children}
    </Card>
  );
}

