import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import { errorHandler } from "@/utils/errorHandler";

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { data, error } = await supabaseAdmin
      .from("departments")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS }, request, lang, 500);

    return NextResponse.json({ departments: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
