import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: authHeader } },
  });

  // Cryptographically verify the JWT with Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Decode the JWT to read custom claims
  const jwt = authHeader.replace("Bearer ", "");
  const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());

  if (!payload.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ Only admins reach here
  const logs = [
    { timestamp: new Date().toISOString(), message: "Example log entry" },
    // your actual logs here
  ];

  return NextResponse.json({ logs });
}
