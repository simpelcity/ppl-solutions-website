import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";
import { errorHandler } from "@/utils/errorHandler";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { display_name } = await request.json();

    if (!display_name || typeof display_name !== "string") {
      return errorHandler({ error: dict.errors.team.NAME_REQUIRED }, request, lang, 400);
    }

    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return errorHandler({ error: dict.errors.members.FAILED_TO_FETCH_MEMBERS }, request, lang, 500);
    }

    const existingUser = users.users.find((user) => user.user_metadata?.display_name === display_name.trim());

    if (existingUser) {
      return NextResponse.json({ available: false, message: dict.errors.team.NAME_REQUIRED });
    }

    return NextResponse.json({ available: true, message: dict.success.team.TEAM_MEMBER_ADDED });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.members.FAILED_TO_FETCH_MEMBERS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
