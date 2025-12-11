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
