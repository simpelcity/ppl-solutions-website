import "@/styles/globals.scss"
import { AuthProvider, SidebarProvider } from "@/lib"
import { i18n, type Locale } from "@/i18n"
import { getDictionary } from "@/app/i18n"
import Providers from "@/app/providers"
import React from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import { cookies } from 'next/headers'

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  const themeCookie = cookieStore.get("ppl-theme")?.value;
  const lang = cookieLocale && i18n.locales.includes(cookieLocale) ? cookieLocale : i18n.defaultLocale;
  const dict = await getDictionary(lang);

  const initialTheme = themeCookie === 'light' || themeCookie === 'dark' || themeCookie === 'system' ? themeCookie : 'system';

  return (
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth" data-initial-theme={initialTheme} data-bs-theme={themeCookie}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="duVuERpK5FIEgDN0EYvy3aDZQukmh7XKYXITYPPj-4w" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet" />
        <script src="https://kit.fontawesome.com/555ef81382.js" crossOrigin="anonymous"></script>
        <link rel="icon" href={`/assets/icons/favicon.ico`} />
      </head>
      <body>
        <Providers>
          <AuthProvider>
            <SidebarProvider dict={dict} lang={lang}>
              {children}
              {process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" && (
                <>
                  <SpeedInsights />
                  <Analytics />
                  <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID!} />
                  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
                </>
              )}
            </SidebarProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}