"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/lib/AuthContext"
import "@/styles/globals.scss"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideFooter = pathname === "/login" || pathname === "/reset-password" || pathname === "/forgot-password"

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/icons/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          {!hideFooter && <Footer />}
        </AuthProvider>
      </body>
    </html>
  )
}
