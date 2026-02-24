import { NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";

axios.defaults.headers.common["Authorization"] = process.env.TRUCKERSHUB_API_TOKEN;
axios.defaults.headers.common["Content-Type"] = "application/json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { steamID } = body;

    if (!steamID) return NextResponse.json({ error: "steamID is required" }, { status: 400 });

    const firstRes = await axios.get(`https://api.truckershub.in/v1/drivers/${steamID}/jobs?page=1`);

    if (firstRes.status !== 200) {
      return errorHandler({ error: "Failed to fetch jobs" }, request, firstRes.status);
    }

    const firstData = await firstRes.data;

    const lastPageUrl = firstData.links?.last;
    const lastPageMatch = lastPageUrl?.match(/[?&]page=(\d+)/);
    const totalPages = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1;

    const allJobs: any[] = [];
    for (let page = 1; page <= totalPages; page++) {
      const res = await axios.get(`https://api.truckershub.in/v1/drivers/${steamID}/jobs?page=${page}`);

      if (res.status !== 200) continue;

      const payload = await res.data;
      if (Array.isArray(payload.data)) {
        allJobs.push(...payload.data);
      }
    }

    return NextResponse.json({
      data: allJobs.reverse(),
      meta: {
        total: allJobs.length,
        pages: totalPages,
      },
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err, request);
  }
}
