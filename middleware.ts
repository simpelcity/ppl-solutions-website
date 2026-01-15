import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /events
    // The new URL is now /en/events
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }
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
