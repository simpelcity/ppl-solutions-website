import Link from "next/link";
import "@/styles/Link.scss";

type LinkVariant = "primary" | "nav" | "transparent" | "light" | "sidebar";

const variantStyles: Record<LinkVariant, string> = {
  primary: "primary-link",
  nav: "navbar-link fs-5",
  transparent: "transparent-link",
  light: "lightlink",
  sidebar: "sidebar-link d-flex align-items-center nav-link",
};

interface LinkProps {
  variant: LinkVariant;
  href: string;
  target?: string;
  classes?: string;
  state?: "active" | "disabled";
  children: React.ReactNode;
}

export default function BSLink({
  variant,
  href,
  target,
  classes,
  state,
  children,
  ...props
}: LinkProps) {
  return (
    <Link href={href} target={target} className={`${variantStyles[variant]} ${state} text-decoration-none ${classes}`} {...props}>
      {children}
    </Link>
  )
}
