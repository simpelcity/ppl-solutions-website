import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { RegisterFormClient } from "@/components/"

type RegisterFormProps = {
  params: Promise<{ lang: Locale }>;
};

export default async function RegisterForm({ params }: RegisterFormProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <RegisterFormClient dict={dict} />
}

