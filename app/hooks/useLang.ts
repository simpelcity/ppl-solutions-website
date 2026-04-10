'use client'

import { usePathname } from 'next/navigation'
import { i18n } from '@/i18n'
import type { Locale } from '@/i18n'

export function useLang(): Locale {
  const pathname = usePathname();

  return (
    i18n.locales.find((locale) => pathname?.startsWith(`/${locale}/`) || pathname === `/${locale}`) || i18n.defaultLocale
  ) as Locale;
}
