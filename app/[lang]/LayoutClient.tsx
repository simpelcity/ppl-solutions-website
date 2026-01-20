"use client"

import { usePathname } from "next/navigation"
import { Navbar, Footer } from "@/components/"
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type Props = {
  children: React.ReactNode
  dict: Dictionary
  lang: Locale
}

export default function LayoutClient({ children, dict, lang }: Props) {
  const pathname = usePathname()
  const hideFooter = pathname?.includes("/login") || pathname?.includes("/register") || pathname?.includes("/reset-password") || pathname?.includes("/forgot-password")

  return (
    <>
      <Navbar dict={dict} />
      {children}
      {!hideFooter && <Footer dict={dict} />}
    </>
  )
}
