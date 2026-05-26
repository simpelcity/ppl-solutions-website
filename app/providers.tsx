"use client"

import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-bs-theme"
      defaultTheme="system"
      enableSystem
      storageKey="ppl-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
