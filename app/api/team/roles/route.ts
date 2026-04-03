import { supabaseAdmin } from "@/supabaseAdmin/";
import { NextResponse } from "next/server";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import { errorHandler } from "@/utils/errorHandler";

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);
    }

    const { data, error } = await supabaseAdmin
      .from("department_team_member")
      .select(
        `
        team_member_id,
        department:departments!inner(id, name),
        role:roles!inner(id, name, code)
      `,
      )
      .eq("team_member_id", memberId);

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_FETCH_TEAM_MEMBER }, request, lang, 500);

    return NextResponse.json({ data });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.team.FAILED_TO_FETCH_TEAM_MEMBER;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const { team_member_id, department_id, role_id } = body;

    if (!team_member_id || !department_id || !role_id) {
      return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);
    }

    const { data, error } = await supabaseAdmin
      .from("department_team_member")
      .insert({ team_member_id, department_id, role_id })
      .select();

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER }, request, lang, 500);

    return NextResponse.json({ data });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const { team_member_id, department_id, role_id } = body;

    if (!team_member_id || !department_id || !role_id) {
      return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);
    }

    const { error } = await supabaseAdmin
      .from("department_team_member")
      .delete()
      .eq("team_member_id", team_member_id)
      .eq("department_id", department_id)
      .eq("role_id", role_id);

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER }, request, lang, 500);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
