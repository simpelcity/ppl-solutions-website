import Button from 'react-bootstrap/Button';
import { ReactNode } from 'react';

interface ButtonOutlineProps {
  children: ReactNode;
  text?: string;
  [key: string]: any;
}

export default function ButtonOutline({ children, border = 'primary', paddingx = '', paddingy = '', text = "light", ...props }: ButtonOutlineProps) {
  return <Button variant="transparent" className={`border border-1 border-${border} text-uppercase text-${text} fw-bold rounded-1`} style={{ padding: `${paddingy}px ${paddingx}px` }} {...props}>
    {children}
  </Button>
}