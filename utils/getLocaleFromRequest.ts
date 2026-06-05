import { NextRequest } from "next/server";
import { i18n } from "@/i18n";
import type { Locale } from "@/i18n";

export function getLocaleFromRequest(request: NextRequest): Locale {
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value as Locale;
  if (localeCookie && i18n.locales.includes(localeCookie as Locale)) {
    return localeCookie;
  }

  const acceptLanguage: Locale = request.headers.get("accept-language") as Locale;
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().split("-")[0])
      .find((lang) => i18n.locales.includes(lang as Locale));

    if (preferredLocale) return preferredLocale as Locale;
  }

  return i18n.defaultLocale;
}
