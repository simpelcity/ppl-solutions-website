import { i18n } from '@/i18n'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}
