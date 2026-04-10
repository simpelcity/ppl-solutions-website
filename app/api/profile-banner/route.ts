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
    
    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);
    const { data, error } = await supabaseAdmin.from("profiles").select("*").eq("id", id).single();
    if (error) return errorHandler(
        { error: dict.errors.profile.profileBanner.FAILED_TO_FETCH_PROFILE_BANNER },
        request,
        lang,
        500,
    );
    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.profile.profileBanner.FAILED_TO_FETCH_PROFILE_BANNER;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const file = formData.get("bannerFile") as File | null;

    let banner_url: string | null = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("profile-banners")
        .upload(`profile-banners/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError)
          return errorHandler(
              { error: dict.errors.profile.profileBanner.FAILED_TO_UPLOAD_PROFILE_BANNER },
              request,
              lang,
              500,
          );

      const { data: publicUrlData } = supabaseAdmin.storage.from("profile-banners").getPublicUrl(uploadData.path);

      banner_url = publicUrlData.publicUrl;
    }

    const payload: any = { banner_url };

    const { data, error } = await supabaseAdmin.from("profiles").insert([payload]).select();

    if (error)
        return errorHandler(
            { error: dict.errors.profile.profileBanner.FAILED_TO_ADD_PROFILE_BANNER },
            request,
            lang,
            500,
        );

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.profile.profileBanner.FAILED_TO_FETCH_PROFILE_BANNER;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const id = formData.get("userId") as string;
    const file = formData.get("bannerFile") as File | null;

    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);

    let banner_url: string | null = null;

    if (file) {
      const { data: memberData, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("banner_url")
        .eq("id", id)
        .single();

      if (fetchError) return errorHandler(
          { error: dict.errors.profile.profilePicture.FAILED_TO_FETCH_PROFILE_PICTURE },
          request,
          lang,
          500,
      );

      if (memberData?.banner_url) {
        try {
          const url = new URL(memberData.banner_url);
          const pathParts = url.pathname.split("/");
          const bucketIndex = pathParts.findIndex((part) => part === "profile-banners");
          if (bucketIndex !== -1) {
            const oldFilePath = pathParts.slice(bucketIndex + 1).join("/");
            await supabaseAdmin.storage.from("profile-banners").remove([oldFilePath]);
          }
        } catch (err: any) {
          console.warn(dict.errors.files.FAILED_TO_DELETE_OLD_FILE, err.message);
        }
      }

      const fileName = `${id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("profile-banners")
        .upload(`profile-banners/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError)
          return errorHandler(
              { error: dict.errors.profile.profileBanner.FAILED_TO_UPLOAD_PROFILE_BANNER },
              request,
              lang,
              500,
          );

      const { data: publicUrlData } = supabaseAdmin.storage.from("profile-banners").getPublicUrl(uploadData.path);

      banner_url = publicUrlData.publicUrl;
    }

    const payload: any = { banner_url };

    const { data, error } = await supabaseAdmin.from("profiles").update(payload).eq("id", id).select();

    if (error)
        return errorHandler(
            { error: dict.errors.profile.profileBanner.FAILED_TO_UPDATE_PROFILE_BANNER },
            request,
            lang,
            500,
        );

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.profile.profileBanner.FAILED_TO_UPDATE_PROFILE_BANNER;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}