import "@/styles/globals.scss"
import { AuthProvider, SidebarProvider } from "@/lib"
import { i18n } from "@/i18n"
import { getDictionary } from "@/app/i18n"
import React from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

type Props = {
  children: React.ReactNode
}

export default async function AppLayout({ children }: Props) {
  const lang = i18n.defaultLocale
  const dict = await getDictionary(lang)
  return (
    <html lang={lang} data-bs-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="duVuERpK5FIEgDN0EYvy3aDZQukmh7XKYXITYPPj-4w" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/icons/favicon.png" />
      </head>
      <body>
        <AuthProvider>
          <SidebarProvider dict={dict} lang={lang}>
            {children}
            <SpeedInsights/>
            <Analytics/>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}