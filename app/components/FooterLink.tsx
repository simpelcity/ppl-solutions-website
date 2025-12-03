import Link from "next/link";
import { ListGroup } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa6";

interface FooterLinkProps {
  children: React.ReactNode;
  link?: string;
  [key: string]: any;
}

export default function FooterLink({ children, link = "", ...props }: FooterLinkProps) {
  return (
    <ListGroup.Item className="border-0 p-0 bg-dark">
      <Link
        href={`/${link}`}
        className="text-decoration-none text-light d-flex align-items-center column-gap-1 footer-link"
        {...props}>
        <FaAngleRight />
        <span>{children}</span>
      </Link>
    </ListGroup.Item>
  );
}
