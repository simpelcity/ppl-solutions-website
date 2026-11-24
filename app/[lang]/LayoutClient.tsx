"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Alert } from "react-bootstrap"
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

  // Free-tier Supabase projects pause when idle; a paused project fails or returns 5xx on its health endpoint.
  const [dbPaused, setDbPaused] = useState(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      signal: AbortSignal.timeout(8000),
    })
      .then((res) => setDbPaused(res.status >= 500))
      .catch(() => setDbPaused(true));
  }, []);

  const [show, setShow] = useState(true)

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      {dbPaused && (
        <Alert variant="warning" onClose={() => setShow(false)} className="rounded-0 mb-0 text-center position-fixed z-1" dismissible>
          <strong>{dict.databasePaused.title}</strong> {dict.databasePaused.body}{" "}
          <Alert.Link href={`${currentLang}/contact`}>{dict.databasePaused.contact}</Alert.Link>
        </Alert>
      )}
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
