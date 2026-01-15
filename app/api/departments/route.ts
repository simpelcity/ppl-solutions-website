import { supabaseAdmin } from "@/lib/"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("departments")
      .select("id, name")
      .order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
