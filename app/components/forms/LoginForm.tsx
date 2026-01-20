import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { LoginFormClient } from "@/components/"

type LoginFormProps = {
  params: Promise<{ lang: Locale }>;
};

export default async function LoginForm({ params }: LoginFormProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <LoginFormClient dict={dict} />
}
