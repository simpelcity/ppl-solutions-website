import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }
    const { data, error } = await supabaseAdmin.from("profiles").select("*").eq("id", id).single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ profile: data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    let profile_url: string | null = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("profile-pictures")
        .upload(`profile-pictures/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage.from("profile-pictures").getPublicUrl(uploadData.path);

      profile_url = publicUrlData.publicUrl;
    }

    const payload: any = { profile_url };

    const { data, error } = await supabaseAdmin.from("profiles").insert([payload]).select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("userId") as string;
    const file = formData.get("file") as File | null;

    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    const updates: any = {};

    if (file) {
      const { data: memberData, error: fetchError } = await supabaseAdmin
        .from("profiles")
        .select("profile_url")
        .eq("id", id)
        .single();

      if (fetchError) return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });

      if (memberData?.profile_url) {
        try {
          const url = new URL(memberData.profile_url);
          const pathParts = url.pathname.split("/");
          const bucketIndex = pathParts.findIndex((part) => part === "profile-pictures");
          if (bucketIndex !== -1) {
            const oldFilePath = pathParts.slice(bucketIndex + 1).join("/");
            await supabaseAdmin.storage.from("profile-pictures").remove([oldFilePath]);
          }
        } catch (e) {
          console.warn("Failed to delete old file (non-fatal):", e);
        }
      }

      const fileName = `${id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("profile-pictures")
        .upload(`profile-pictures/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("profile-pictures")
        .getPublicUrl(`profile-pictures/${fileName}`);

      updates.profile_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin.from("profiles").update(updates).eq("id", id).select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
