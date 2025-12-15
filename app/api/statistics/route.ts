import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch first page to determine total pages
    const firstRes = await fetch("https://api.truckershub.in/v1/jobs?page=1", {
      headers: {
        Authorization: `${process.env.TRUCKERSHUB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!firstRes.ok) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: firstRes.status })
    }

    const firstData = await firstRes.json()
    
    // Parse last page from links (same as TableJobs)
    const lastPageUrl = firstData.links?.last
    const lastPageMatch = lastPageUrl?.match(/[?&]page=(\d+)/)
    const totalPages = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1

    // Fetch all pages sequentially
    const allJobs: any[] = []
    for (let page = 1; page <= totalPages; page++) {
      const res = await fetch(`https://api.truckershub.in/v1/jobs?page=${page}`, {
        headers: {
          Authorization: `${process.env.TRUCKERSHUB_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) continue

      const payload = await res.json()
      if (Array.isArray(payload.data)) {
        allJobs.push(...payload.data)
      }
    }

    return NextResponse.json({
      data: allJobs.reverse(), // Reverse to show newest first
      meta: {
        total: allJobs.length,
        pages: totalPages,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
