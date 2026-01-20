import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { ResetPasswordFormClient } from "@/components/"

type LoginFormProps = {
  params: Promise<{ lang: Locale }>;
};

export default async function ResetPasswordForm({ params }: LoginFormProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <ResetPasswordFormClient dict={dict} />
}