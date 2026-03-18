import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data: data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("userId") as string;
    const displayName = formData.get("displayName") as string;

    if (!id) return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { display_name: displayName },
    });

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
