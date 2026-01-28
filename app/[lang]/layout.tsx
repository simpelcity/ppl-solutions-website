import { Navbar } from "@/components/"
import { AuthProvider, SidebarProvider } from "@/lib/"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import LayoutClient from "../[lang]/LayoutClient"
import "@/styles/globals.scss"

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <html lang={lang}>
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
          <SidebarProvider>
            <LayoutClient dict={dict} lang={lang as Locale}>
              {children}
            </LayoutClient>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
