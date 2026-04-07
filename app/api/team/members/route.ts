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
      .from("team_members")
      .select("id,name,profile_url")
      .order("id", { ascending: true });

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_FETCH_TEAM }, request, lang, 500);

    return NextResponse.json({ members: data }, { status: 200 });
  } catch (e: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = e?.response?.data?.message || e?.message;
    const message = dict.errors.team.FAILED_TO_FETCH_TEAM;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
