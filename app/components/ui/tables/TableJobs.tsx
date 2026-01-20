import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { TableJobsClient } from "@/components/"

type TableJobsProps = {
  params: Promise<{ lang: Locale }>;
};

export default async function TableJobs({ params }: TableJobsProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <TableJobsClient dict={dict} />
}
