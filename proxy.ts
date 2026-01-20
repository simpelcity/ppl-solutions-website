import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname has a locale prefix
  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale) {
    // If the locale is the default (en), rewrite to remove it from the URL
    if (pathnameLocale === i18n.defaultLocale) {
      const newPathname = pathname.replace(`/${pathnameLocale}`, '') || '/'
      return NextResponse.rewrite(new URL(`/${pathnameLocale}${newPathname}`, request.url))
    }
    // For non-default locales, continue normally
    return NextResponse.next()
  }

  // No locale in pathname - determine which locale to use
  const locale = getLocale(request)

  // If it's not the default locale, redirect to add the locale prefix
  if (locale !== i18n.defaultLocale) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }

  // For default locale, rewrite to add locale prefix internally without showing in URL
  return NextResponse.rewrite(
    new URL(`/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
  )
}

function getLocale(request: NextRequest): string {
  // Try to get locale from cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && i18n.locales.includes(localeCookie as any)) {
    return localeCookie
  }

  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0])
      .find((lang) => i18n.locales.includes(lang as any))
    
    if (preferredLocale) {
      return preferredLocale
    }
  }

  return i18n.defaultLocale
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
}
