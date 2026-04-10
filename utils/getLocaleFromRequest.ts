import { NextRequest } from "next/server";
import { i18n } from "@/i18n";
import type { Locale } from "@/i18n";

export function getLocaleFromRequest(request: Request | NextRequest): Locale {
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang");

    if (lang && i18n.locales.includes(lang as Locale)) {
        return lang as Locale;
    }

    return i18n.defaultLocale as Locale;
}
