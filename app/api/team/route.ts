import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // fetch department-team-member joins with aliases
    const { data: items, error } = await supabaseAdmin
      .from("department_team_member")
      .select(`
        department:departments!inner(id, name),
        team_member:team_members!inner(id, name, profile_url, profile_path, admin),
        role:roles!inner(id, name, code)
      `)
      .order("department_id", { ascending: true }); // ordering by pivot column

    if (error) throw error;

    // Resolve missing profile_url via storage if profile_path exists
    const itemsWithUrls = await Promise.all(
      (items || []).map(async (item: any) => {
        const member = item.team_member || {};
        if (member.profile_url) return item;

        if (member.profile_path) {
          try {
            const { data: publicUrlData } = supabaseAdmin.storage
              .from("members")
              .getPublicUrl(member.profile_path);

            // attach resolved url (getPublicUrl returns data.publicUrl)
            return {
              ...item,
              team_member: { ...member, profile_url: publicUrlData?.publicUrl ?? null },
            };
          } catch (e) {
            // non-fatal — return member without profile_url
            return item;
          }
        }

        return item;
      })
    );

    return new Response(JSON.stringify({ data: itemsWithUrls }), { status: 200 });
  } catch (err: any) {
    console.error("GET /api/team error:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const functionTitle = formData.get("function") as string | null;
    const role = formData.get("role") as string | null;
    const file = formData.get("file") as File | null;

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    let profile_url: string | null = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("members")
        .upload(`profiles/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("members")
        .getPublicUrl(uploadData.path);

      profile_url = publicUrlData.publicUrl;
    }

    const payload: any = { name, profile_url };
    if (functionTitle) payload.function = functionTitle;
    if (role) payload.role = role;

    const { data, error } = await supabaseAdmin
      .from("team_members")
      .insert([payload])
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
    const name = formData.get("name") as string | null;
    const functionTitle = formData.get("function") as string | null;
    const role = formData.get("role") as string | null;
    const file = formData.get("file") as File | null;

    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

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

      if (fetchError) return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });

      if (memberData?.profile_url) {
        try {
          const url = new URL(memberData.profile_url);
          const pathParts = url.pathname.split("/");
          const bucketIndex = pathParts.findIndex(part => part === "members");
          if (bucketIndex !== -1) {
            const oldFilePath = pathParts.slice(bucketIndex + 1).join("/");
            await supabaseAdmin.storage.from("members").remove([oldFilePath]);
          }
        } catch (e) {
          console.warn("Failed to delete old file (non-fatal):", e);
        }
      }

      const fileName = `${id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("members")
        .upload(`profiles/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("members")
        .getPublicUrl(`profiles/${fileName}`);

      updates.profile_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from("team_members")
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

    const { data, error } = await supabaseAdmin.from("team_members").delete().eq("id", id).select();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    const { data: memberData, error: fetchError } = await supabaseAdmin
      .from("team_members")
      .select("id, profile_url, profile_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
    }

    if (!memberData) {
      return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });
    }

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
      } catch (e) {
        console.warn("Could not parse profile_url:", e);
      }
    }

    if (pathsToDelete.length > 0) {
      const uniquePaths = Array.from(new Set(pathsToDelete));
      const { error: removeError } = await supabaseAdmin.storage.from("members").remove(uniquePaths);
      if (removeError) {
        console.warn("Failed removing files:", removeError.message);
      }
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("team_members")
      .update({ profile_url: null, profile_path: null })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data: updated }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
