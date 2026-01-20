import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { ForgotPasswordFormClient } from "@/components/"

type ForgotPasswordFormProps = {
  params: Promise<{ lang: Locale }>;
};

export default async function ForgotPasswordForm({ params }: ForgotPasswordFormProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <ForgotPasswordFormClient dict={dict} />
}