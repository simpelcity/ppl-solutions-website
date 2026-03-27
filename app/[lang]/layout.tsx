import { AuthProvider, SidebarProvider } from "@/lib"
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import LayoutClient from "../[lang]/LayoutClient"

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <AuthProvider>
      <SidebarProvider dict={dict} lang={lang}>
        <LayoutClient dict={dict} lang={lang}>
          {children}
        </LayoutClient>
      </SidebarProvider>
    </AuthProvider>
  )
}
