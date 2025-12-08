import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data: members, error } = await supabaseAdmin
      .from("team")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    const membersWithUrls = members.map((member: any) => {
      if (member.profile_url) {
        return member;
      }

      if (member.profile_path) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("members")
          .getPublicUrl(member.profile_path);

        return { ...member, profile_url: publicUrlData.publicUrl };
      }

      return member;
    });

    return new Response(JSON.stringify({ data: membersWithUrls }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Create a new team member (with optional profile picture)
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

    // include function and role in insert
    const payload: any = { name, profile_url };
    if (functionTitle) payload.function = functionTitle;
    if (role) payload.role = role;

    const { data, error } = await supabaseAdmin
      .from("team")
      .insert([payload])
      .select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Update team member (name, function/role and/or profile picture)
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
      // fetch current member to remove old profile (optional, as you already do)
      const { data: memberData, error: fetchError } = await supabaseAdmin
        .from("team")
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
      .from("team")
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

    const { data, error } = await supabaseAdmin.from("team").delete().eq("id", id).select();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Remove a member's profile picture (set profile_url/profile_path to null and delete file)
export async function PATCH(req: Request) {
  try {
    // expect JSON: { id: number }
    const body = await req.json();
    const id = body?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    // 1) Fetch the member row to know what to delete
    const { data: memberData, error: fetchError } = await supabaseAdmin
      .from("team")
      .select("id, profile_url, profile_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
    }

    if (!memberData) {
      return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });
    }

    // determine path(s) to delete
    const pathsToDelete: string[] = [];

    // If you stored the path directly in profile_path, add it
    if (memberData.profile_path) {
      pathsToDelete.push(memberData.profile_path);
    }

    // If you only stored a public URL in profile_url, derive the path
    if (memberData.profile_url) {
      try {
        const url = new URL(memberData.profile_url);
        // Example Supabase public URL path:
        // /storage/v1/object/public/members/profiles/xxx.jpg
        const parts = url.pathname.split("/").filter(Boolean);
        // find the index of the bucket name "members"
        const bucketIndex = parts.findIndex((p) => p === "members");
        if (bucketIndex !== -1) {
          // path after 'members'
          const filePath = parts.slice(bucketIndex + 1).join("/");
          if (filePath) pathsToDelete.push(filePath);
        } else {
          // If your URL has query param like ?file=profiles/xxx.jpg (unlikely) try to parse that too
          // (no-op here)
        }
      } catch (e) {
        // ignore parse errors
        console.warn("Could not parse profile_url:", e);
      }
    }

    // 2) Remove files from storage (if any)
    if (pathsToDelete.length > 0) {
      // remove deduplicated list
      const uniquePaths = Array.from(new Set(pathsToDelete));
      const { error: removeError } = await supabaseAdmin.storage.from("members").remove(uniquePaths);
      if (removeError) {
        // Not fatal — warn and continue to clear DB, but return error if you prefer
        console.warn("Failed removing files:", removeError.message);
        // Option: return error here if deletion strict required:
        // return new Response(JSON.stringify({ error: removeError.message }), { status: 500 });
      }
    }

    // 3) Update DB row to clear profile url/path
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("team")
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
