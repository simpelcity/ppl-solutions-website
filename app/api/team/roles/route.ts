import { supabaseAdmin } from "@/supabaseAdmin/";
import { NextResponse } from "next/server";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

export async function GET(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("department_team_member")
      .select(
        `
        team_member_id,
        department:departments!inner(id, name),
        role:roles!inner(id, name, code)
      `,
      )
      .eq("team_member_id", memberId);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const { team_member_id, department_id, role_id } = body;

    if (!team_member_id || !department_id || !role_id) {
      return NextResponse.json({ error: "team_member_id, department_id, and role_id are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("department_team_member")
      .insert({ team_member_id, department_id, role_id })
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const { team_member_id, department_id, role_id } = body;

    if (!team_member_id || !department_id || !role_id) {
      return NextResponse.json({ error: "team_member_id, department_id, and role_id are required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("department_team_member")
      .delete()
      .eq("team_member_id", team_member_id)
      .eq("department_id", department_id)
      .eq("role_id", role_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
