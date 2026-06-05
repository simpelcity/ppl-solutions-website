"use client"

import { usePathname } from "next/navigation"
import { Navbar, Footer, DrivershubLayout } from "@/components"
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

  const showDrivershubLayoutByPath = pathname.startsWith(`${currentLang}/drivershub`);
  const drivershubPages = showDrivershubLayoutByPath && !forceHideDashboard;

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      {drivershubPages ? (
        <DrivershubLayout dict={dict} lang={lang}>
          {children}
          {!hideFooter && <Footer dict={dict} lang={lang} />}
        </DrivershubLayout>
      ) : (
        <>
          {children}
          {!hideFooter && <Footer dict={dict} lang={lang} />}
        </>
      )}
    </>
  )
}
