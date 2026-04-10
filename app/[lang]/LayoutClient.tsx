"use client"

import { usePathname } from "next/navigation"
import { Navbar, Footer, Dashboard } from "@/components"
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type Props = {
  children: React.ReactNode;
  dict: Dictionary;
  lang: Locale;
  forceHideFooter?: boolean;
  forceHideDashboard?: boolean;
}

export default function LayoutClient({ children, dict, lang, forceHideFooter = false, forceHideDashboard = false }: Props) {
  const pathname = usePathname();
  const hideFooterByPath = pathname?.includes("/login") || pathname?.includes("/register") || pathname?.includes("/reset-password") || pathname?.includes("/forgot-password");
  const hideFooter = forceHideFooter || hideFooterByPath;

  const currentLang = lang === 'en' ? '' : `/${lang}`;

  const showDashboardByPath = pathname.startsWith(`${currentLang}/drivershub`);
  const drivershubPages = showDashboardByPath && !forceHideDashboard;

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      {drivershubPages ? (
        <Dashboard dict={dict} lang={lang}>
          {children}
          {!hideFooter && <Footer dict={dict} />}
        </Dashboard>
      ) : (
        <>
          {children}
          {!hideFooter && <Footer dict={dict} />}
        </>
      )}
    </>
  )
}
