import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin/";

export async function POST(request: NextRequest) {
  try {
    const { display_name } = await request.json();

    if (!display_name || typeof display_name !== 'string') {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }

    // Query auth.users for existing display_name
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Failed to check display name" }, { status: 500 });
    }

    // Check if any user has the same display_name
    const existingUser = users.users.find(user =>
      user.user_metadata?.display_name === display_name.trim()
    );

    if (existingUser) {
      return NextResponse.json({ available: false, message: "Display name already taken" });
    }

    return NextResponse.json({ available: true, message: "Display name is available" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}