import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://api.truckershub.in/v1/drivers", {
      headers: {
        Authorization: `${process.env.TRUCKERSHUB_API_TOKEN}`,
        "Content-Type": "application/json",
        "method": "GET",
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch members" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
