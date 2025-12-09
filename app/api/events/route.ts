// app/api/events/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://api.truckersmp.com/v2/vtc/74455/events/attending"
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic";
