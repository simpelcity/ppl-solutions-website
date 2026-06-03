
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import { errorHandler } from "@/utils/errorHandler";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const caller = await getAuthenticatedUser(request);
    if (!caller) {
      return errorHandler({ error: dict.statusCodes.UNAUTHORIZED }, request, lang, 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);
    }
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error) return errorHandler({ error: dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE }, request, lang, 500);

    // Only expose public fields — never return email, phone, identities, or app_metadata
    const { user } = data;
    const publicProfile = {
      user: {
        id: user.id,
        created_at: user.created_at,
        user_metadata: {
          display_name: user.user_metadata?.display_name,
          username: user.user_metadata?.username,
        },
      },
    };

    return NextResponse.json({ profile: publicProfile }, { status: 200 });
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

    const caller = await getAuthenticatedUser(request);
    if (!caller) {
      return errorHandler({ error: dict.statusCodes.UNAUTHORIZED }, request, lang, 401);
    }

    const formData = await request.formData();
    const id = formData.get("userId") as string;
    const displayName = formData.get("displayName") as string;

    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);

    const isOwner = caller.id === id;
    const isAdmin = caller.app_metadata?.is_admin === true;
    if (!isOwner && !isAdmin) {
      return errorHandler({ error: dict.statusCodes.FORBIDDEN }, request, lang, 403);
    }

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
