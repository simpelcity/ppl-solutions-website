import { AuthProvider, SidebarProvider } from "@/lib"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import LayoutClient from "../[lang]/LayoutClient"

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <AuthProvider>
      <SidebarProvider>
        <LayoutClient dict={dict} lang={lang as Locale}>
          {children}
        </LayoutClient>
      </SidebarProvider>
    </AuthProvider>
  )
}
