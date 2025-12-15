import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type GalleryItem = {
  id: number;
  title?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export async function GET() {
  try {
    const { data: rows, error } = await supabaseAdmin
      .from("gallery")
      .select("id, title, image_path, image_url, created_at")
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;

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
            const { data: publicUrlData } = supabaseAdmin.storage
              .from("gallery")
              .getPublicUrl(item.image_path);

            item.image_url = publicUrlData?.publicUrl ?? null;
          } catch (err) {
          }
        }

        return item;
      })
    );

    return new Response(JSON.stringify({ data: items }), { status: 200 });
  } catch (err: any) {
    console.error("GET /api/gallery error:", err);
    return new Response(JSON.stringify({ error: err.message ?? String(err) }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const file = formData.get("file") as File | null;

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
    }

    if (!file) {
      return new Response(JSON.stringify({ error: "Image file is required" }), { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("gallery")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("gallery")
      .getPublicUrl(uploadData.path);

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

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
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

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("gallery")
        .getPublicUrl(fileName);

      updates.image_path = uploadData.path;
      updates.image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from("gallery")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
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
