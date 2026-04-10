
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import { errorHandler } from "@/utils/errorHandler";

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);
    }
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error) return errorHandler({ error: dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE }, request, lang, 500);

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const id = formData.get("userId") as string;
    const displayName = formData.get("displayName") as string;

    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { display_name: displayName },
    });

    if (error) return errorHandler({ error: dict.errors.profile.profile.FAILED_TO_UPDATE_PROFILE }, request, lang, 500);

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.profile.profile.FAILED_TO_UPDATE_PROFILE;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
