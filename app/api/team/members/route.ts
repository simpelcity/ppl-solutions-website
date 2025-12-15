import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
	try {
		const { data, error } = await supabaseAdmin
			.from("team_members")
			.select("id,name,profile_url")
			.order("id", { ascending: true })

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		return NextResponse.json({ data: data ?? [] }, { status: 200 })
	} catch (e: any) {
		return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
	}
}
