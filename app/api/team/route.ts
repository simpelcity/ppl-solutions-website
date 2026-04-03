import { supabaseAdmin } from "@/supabaseAdmin/";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { data: items, error } = await supabaseAdmin
      .from("department_team_member")
      .select(
        `
        department:departments!inner(id, name, name_en, name_nl, name_cs, name_sk),
        team_member:team_members!inner(id, name, profile_url, profile_path),
        role:roles!inner(id, name, code, name_en, name_nl, name_cs, name_sk)
      `,
      )
      .order("department_id", { ascending: true });


      if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_FETCH_TEAM, serverError: error.message }, request, lang, 500);

    const translatedItems = (items || []).map((item: any) => {
      const dept = item.department || {};
      const role = item.role || {};
      const translatedDeptName = dept[`name_${lang}`] || dept.name;
      const translatedRoleName = role[`name_${lang}`] || role.name;

      return {
        ...item,
        department: { ...dept, name: translatedDeptName },
        role: { ...role, name: translatedRoleName },
      };
    });

    const itemsWithUrls = await Promise.all(
      translatedItems.map(async (item: any) => {
        const member = item.team_member || {};
        if (member.profile_url) return item;

        if (member.profile_path) {
          try {
            const { data: publicUrlData } = supabaseAdmin.storage.from("members").getPublicUrl(member.profile_path);
            return {
              ...item,
              team_member: { ...member, profile_url: publicUrlData?.publicUrl ?? null },
            };
          } catch (err: any) {
            console.warn(dict.errors.profile.profilePicture.FAILED_TO_GET_PROFILE_PICTURE, err.message);
          }
        }

        return item;
      }),
    );

    return NextResponse.json({ team: itemsWithUrls }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const message = dict.errors.team.FAILED_TO_FETCH_TEAM;
    const serverMessage = err.message || String(err);
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const functionTitle = formData.get("function") as string | null;
    const role = formData.get("role") as string | null;
    const file = formData.get("file") as File | null;

    if (!name) return errorHandler({ error: dict.errors.team.NAME_REQUIRED }, request, lang, 400);

    let profile_url: string | null = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("members")
        .upload(`profiles/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) return errorHandler({ error: dict.errors.profile.profilePicture.FAILED_TO_UPLOAD_PROFILE_PICTURE, serverError: uploadError.message }, request, lang, 500);

      const { data: publicUrlData } = supabaseAdmin.storage.from("members").getPublicUrl(uploadData.path);

      profile_url = publicUrlData.publicUrl;
    }

    const payload: any = { name, profile_url };
    if (functionTitle) payload.function = functionTitle;
    if (role) payload.role = role;

    const { data, error } = await supabaseAdmin.from("team_members").insert([payload]).select();

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER, serverError: error.message }, request, lang, 500);

    return NextResponse.json({ team: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const message = dict.errors.team.FAILED_TO_ADD_TEAM_MEMBER;
    const serverMessage = err.message || String(err);
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string | null;
    const functionTitle = formData.get("function") as string | null;
    const role = formData.get("role") as string | null;
    const file = formData.get("file") as File | null;

    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);

    const updates: any = {};
    if (name) updates.name = name;
    if (functionTitle) updates.function = functionTitle;
    if (role) updates.role = role;

    if (file) {
      const { data: memberData, error: fetchError } = await supabaseAdmin
        .from("team_members")
        .select("profile_url")
        .eq("id", id)
        .single();

      if (fetchError) return errorHandler({ error: dict.errors.team.FAILED_TO_FETCH_TEAM_MEMBER, serverError: fetchError.message }, request, lang, 500);

      if (memberData?.profile_url) {
        try {
          const url = new URL(memberData.profile_url);
          const pathParts = url.pathname.split("/");
          const bucketIndex = pathParts.findIndex((part) => part === "members");
          if (bucketIndex !== -1) {
            const oldFilePath = pathParts.slice(bucketIndex + 1).join("/");
            await supabaseAdmin.storage.from("members").remove([oldFilePath]);
          }
        } catch (err: any) {
          console.warn(dict.errors.files.FAILED_TO_DELETE_OLD_FILE, err.message);
        }
      }

      const fileName = `${id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("members")
        .upload(`profiles/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) return errorHandler({ error: dict.errors.profile.profilePicture.FAILED_TO_UPLOAD_PROFILE_PICTURE, serverError: uploadError.message }, request, lang, 500);

      const { data: publicUrlData } = supabaseAdmin.storage.from("members").getPublicUrl(`profiles/${fileName}`);

      updates.profile_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin.from("team_members").update(updates).eq("id", id).select();

    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER, serverError: error.message }, request, lang, 500);

    return NextResponse.json({ team: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const message = dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER;
    const serverMessage = err.message || String(err);
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { id } = await request.json();
    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);

    const { data, error } = await supabaseAdmin.from("team_members").delete().eq("id", id).select();
    if (error) return errorHandler({ error: dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER, serverError: error.message }, request, lang, 500);

    return NextResponse.json({ team: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const message = dict.errors.team.FAILED_TO_DELETE_TEAM_MEMBER;
    const serverMessage = err.message || String(err);
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const id = body?.id;
    if (!id) return errorHandler({ error: dict.errors.team.ID_REQUIRED }, request, lang, 400);

    const { data: memberData, error: fetchError } = await supabaseAdmin
      .from("team_members")
      .select("id, profile_url, profile_path")
      .eq("id", id)
      .single();

    if (fetchError) return errorHandler({ error: dict.errors.profile.profilePicture.FAILED_TO_FETCH_PROFILE_PICTURE, serverError: fetchError.message }, request, lang, 500);

    if (!memberData) return errorHandler({ error: dict.errors.members.MEMBER_NOT_FOUND }, request, lang, 404);

    const pathsToDelete: string[] = [];

    if (memberData.profile_path) {
      pathsToDelete.push(memberData.profile_path);
    }

    if (memberData.profile_url) {
      try {
        const url = new URL(memberData.profile_url);
        const parts = url.pathname.split("/").filter(Boolean);
        const bucketIndex = parts.findIndex((p) => p === "members");
        if (bucketIndex !== -1) {
          const filePath = parts.slice(bucketIndex + 1).join("/");
          if (filePath) pathsToDelete.push(filePath);
        } else {
        }
      } catch (err: any) {
        console.warn(dict.errors.profile.profilePicture.FAILED_TO_PARSE_PFP_URL, err.message);
      }
    }

    if (pathsToDelete.length > 0) {
      const uniquePaths = Array.from(new Set(pathsToDelete));
      const { error: removeError } = await supabaseAdmin.storage.from("members").remove(uniquePaths);
      if (removeError) {
        console.warn(dict.errors.files.FAILED_TO_REMOVE_FILES, removeError.message);
      }
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("team_members")
      .update({ profile_url: null, profile_path: null })
      .eq("id", id)
      .select()
      .single();

    if (updateError) return errorHandler({ error: dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER, serverError: updateError.message }, request, lang, 500);

    return NextResponse.json({ team: updated }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const message = dict.errors.team.FAILED_TO_UPDATE_TEAM_MEMBER;
    const serverMessage = err.message || String(err);
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
