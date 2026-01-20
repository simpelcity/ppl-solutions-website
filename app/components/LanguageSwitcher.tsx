'use client'

import { usePathname, useRouter } from 'next/navigation'
import { i18n, type Locale } from '@/i18n'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const getCurrentLocale = (): Locale => {
    const segments = pathname.split('/')
    const localeSegment = segments[1]
    return i18n.locales.includes(localeSegment as Locale)
      ? (localeSegment as Locale)
      : i18n.defaultLocale
  }

  const switchLanguage = (newLocale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`

    router.push(newPath)
  }

  const currentLocale = getCurrentLocale()

  return (
    <div className="language-switcher">
      <select
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value as Locale)}
        className="form-select form-select-sm"
        style={{ width: 'auto' }}
      >
        <option value="en">🇬🇧 English</option>
        <option value="nl">🇳🇱 Nederlands</option>
        <option value="cs">🇨🇿 Čeština</option>
      </select>
    </div>
  )
}