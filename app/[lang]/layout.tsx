"use client"

import { usePathname } from "next/navigation"
import { Navbar, Footer } from "@/components/"
import { AuthProvider, SidebarProvider } from "@/lib/"
import "@/styles/globals.scss"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideFooter = pathname?.includes("/login") || pathname?.includes("/reset-password") || pathname?.includes("/forgot-password")

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="duVuERpK5FIEgDN0EYvy3aDZQukmh7XKYXITYPPj-4w" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/icons/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            {children}
            {!hideFooter && <Footer />}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
