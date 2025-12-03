import Button from 'react-bootstrap/Button';
import { ReactNode } from 'react';

interface ButtonPrimaryProps {
  children: ReactNode;
  text?: string;
  [key: string]: any;
}

export default function ButtonPrimary({ children, text = "light", ...props }: ButtonPrimaryProps) {
  return <Button variant="primary" className={`border border-2 border-primary text-uppercase text-${text} fw-bold rounded-1`} {...props}>
    {children}
  </Button>
}