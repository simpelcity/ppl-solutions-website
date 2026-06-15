import Link from "next/link";
import "@/styles/ui/BSLink.scss";
import { FaAngleRight } from "react-icons/fa6";

type LinkVariant = 'primary' | 'nav' | 'transparent' | 'light' | 'sidebar' | 'footer' | 'discord';

const variantStyles: Record<LinkVariant, string> = {
  primary: 'primary-link',
  nav: 'navbar-link text-theme fs-5 px-xl-0 pt-xl-0 text-center mx-xl-2',
  transparent: 'transparent-link',
  light: 'light-link',
  sidebar: 'sidebar-link d-flex align-items-center nav-link',
  footer: 'footer-link text-theme d-flex align-items-center column-gap-1 fw-semibold',
  discord: 'discord-link'
};

interface LinkProps {
  variant: LinkVariant;
  href: string;
  target?: string;
  classes?: string;
  state?: 'active' | 'disabled';
  rel?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function BSLink({
  variant,
  href,
  target,
  classes,
  state,
  rel = 'noopener noreferrer',
  children,
  ...props
}: LinkProps) {
  const optionalClasses = [state, classes].filter(Boolean).join(' ');

  return (
    <Link href={href} target={target} rel={rel} className={`${variantStyles[variant]} text-decoration-none${optionalClasses ? ` ${optionalClasses}` : ''}`} {...props}>
      {variant === 'footer' && <FaAngleRight />}
      {variant === 'footer' ? <span>{children}</span> : children}
    </Link>
  )
}
