import { supabaseAdmin } from "@/supabaseAdmin/"
import { NextResponse } from "next/server"

// Get all department-role assignments for a specific team member
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get("memberId")

    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("department_team_member")
      .select(`
        team_member_id,
        department:departments!inner(id, name),
        role:roles!inner(id, name, code)
      `)
      .eq("team_member_id", memberId)

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

// Add a department-role assignment to a team member
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { team_member_id, department_id, role_id } = body

    if (!team_member_id || !department_id || !role_id) {
      return NextResponse.json(
        { error: "team_member_id, department_id, and role_id are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("department_team_member")
      .insert({ team_member_id, department_id, role_id })
      .select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

// Remove a department-role assignment from a team member
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { team_member_id, department_id, role_id } = body

    if (!team_member_id || !department_id || !role_id) {
      return NextResponse.json(
        { error: "team_member_id, department_id, and role_id are required" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("department_team_member")
      .delete()
      .eq("team_member_id", team_member_id)
      .eq("department_id", department_id)
      .eq("role_id", role_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
