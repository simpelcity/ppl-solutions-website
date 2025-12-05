import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // 1. Fetch all team members
    const { data: members, error } = await supabaseAdmin
      .from("team")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    // 2. Ensure profile_url is a valid public URL for storage
    const membersWithUrls = members.map((member: any) => {
      if (member.profile_url) {
        // In case the URL is already stored as a Supabase public URL, leave it
        return member;
      }

      // Optional: fallback if only path is stored instead of full URL
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
    const file = formData.get("file") as File | null;

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    let profile_url: string | null = null;

    if (file) {
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("members")
        .upload(`profiles/${file.name}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("members")
        .getPublicUrl(uploadData.path);

      profile_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from("team")
      .insert([{ name, profile_url }])
      .select();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Update team member (name and/or profile picture)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string | null;
    const file = formData.get("file") as File | null;

    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    const updates: any = {};
    if (name) updates.name = name;

    if (file) {
      // 1. Fetch the current member to get old profile URL
      const { data: memberData, error: fetchError } = await supabaseAdmin
        .from("team")
        .select("profile_url")
        .eq("id", id)
        .single();

      if (fetchError) return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });

      // 2. Delete old profile picture if it exists
      if (memberData?.profile_url) {
        // Extract the path after the bucket name "members/"
        const url = new URL(memberData.profile_url);
        const pathParts = url.pathname.split("/"); // e.g., ['', 'storage', 'v1', 'object', 'public', 'members', 'profiles', 'file.jpg']
        const bucketIndex = pathParts.findIndex(part => part === "members");
        if (bucketIndex !== -1) {
          const oldFilePath = pathParts.slice(bucketIndex + 1).join("/"); // 'profiles/file.jpg'
          const { error: deleteError } = await supabaseAdmin.storage
            .from("members")
            .remove([oldFilePath]);

          if (deleteError) console.warn("Failed to delete old profile photo:", deleteError.message);
        }
      }

      // 3. Upload the new file
      const fileName = `${id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("members")
        .upload(`profiles/${fileName}`, file, { cacheControl: "3600", upsert: true });

      if (uploadError) return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });

      // 4. Get the public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("members")
        .getPublicUrl(`profiles/${fileName}`);

      updates.profile_url = publicUrlData.publicUrl;
    }

    // 5. Update the member in the database
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


// Delete a member
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
