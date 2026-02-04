import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { steamID } = body;

    if (!steamID) return NextResponse.json({ error: "steamID is required" }, { status: 400 });

    const res = await fetch(`https://api.truckershub.in/v1/drivers/${steamID}/scenarios`, {
      headers: {
        Authorization: `${process.env.TRUCKERSHUB_API_TOKEN}`,
        "Content-Type": "application/json",
        "method": "GET",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to fetch scenarios", details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
