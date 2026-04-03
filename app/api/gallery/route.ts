import { supabaseAdmin } from "@/supabaseAdmin/";
import { NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

export type GalleryItem = {
  id: number;
  title?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { data: rows, error } = await supabaseAdmin
      .from("gallery")
      .select("id, title, image_path, image_url, created_at")
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) return errorHandler({ error: dict.errors.gallery.ERROR_LOADING_GALLERY }, request, lang, 500);

    const items = await Promise.all(
      (rows || []).map(async (r: any) => {
        const item: GalleryItem = {
          id: r.id,
          title: r.title,
          image_path: r.image_path,
          image_url: r.image_url ?? null,
          created_at: r.created_at,
        };

        if (!item.image_url && item.image_path) {
          try {
            const { data: publicUrlData } = supabaseAdmin.storage.from("gallery").getPublicUrl(item.image_path);

            item.image_url = publicUrlData?.publicUrl ?? null;
          } catch (err) {}
        }

        return item;
      }),
    );

    return new Response(JSON.stringify({ data: items }), { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.gallery.ERROR_LOADING_GALLERY;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const file = formData.get("file") as File | null;

    if (!title) {
      return errorHandler({ error: dict.errors.gallery.TITLE_REQUIRED }, request, lang, 400);
    }

    if (!file) {
      return errorHandler({ error: dict.errors.files.IMAGE_FILE_REQUIRED }, request, lang, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorHandler({ error: dict.errors.files.FILE_TOO_LARGE }, request, lang, 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;

    const buffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("gallery")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("gallery").getPublicUrl(uploadData.path);

    const image_url = publicUrlData.publicUrl;

    const { data, error } = await supabaseAdmin
      .from("gallery")
      .insert([{ title, image_path: uploadData.path, image_url }])
      .select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string | null;
    const file = formData.get("file") as File | null;

    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    const updates: any = {};
    if (title) updates.title = title;

    if (file) {
      const { data: itemData, error: fetchError } = await supabaseAdmin
        .from("gallery")
        .select("image_path")
        .eq("id", id)
        .single();

      if (fetchError) return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });

      if (itemData?.image_path) {
        try {
          await supabaseAdmin.storage.from("gallery").remove([itemData.image_path]);
        } catch (e) {
          console.warn("Failed to delete old file (non-fatal):", e);
        }
      }

      const fileName = `${id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("gallery")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });

      const { data: publicUrlData } = supabaseAdmin.storage.from("gallery").getPublicUrl(fileName);

      updates.image_path = uploadData.path;
      updates.image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin.from("gallery").update(updates).eq("id", id).select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { id } = await request.json();
    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    const { data: itemData, error: fetchError } = await supabaseAdmin
      .from("gallery")
      .select("image_path")
      .eq("id", id)
      .single();

    if (fetchError) return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });

    if (itemData?.image_path) {
      try {
        await supabaseAdmin.storage.from("gallery").remove([itemData.image_path]);
      } catch (e) {
        console.warn("Failed to delete file (non-fatal):", e);
      }
    }

    const { data, error } = await supabaseAdmin.from("gallery").delete().eq("id", id).select();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
