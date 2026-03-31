import { NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

axios.defaults.headers.common["Authorization"] = process.env.TRUCKERSHUB_API_TOKEN;
axios.defaults.headers.common["Content-Type"] = "application/json";

export async function GET(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let apiUrl = "https://api.truckershub.in/v1/jobs?page=1";
    if (month && year) {
      apiUrl += `&month=${month}&year=${year}`;
    }

    const firstRes = await axios.get(apiUrl);

    if (firstRes.status !== 200) {
      return errorHandler({ error: "Failed to fetch jobs" }, request, lang, firstRes.status);
    }

    const firstData = await firstRes.data;

    const lastPageUrl = firstData.links?.last;
    const lastPageMatch = lastPageUrl?.match(/[?&]page=(\d+)/);
    const totalPages = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1;

    const allJobs: any[] = [];
    for (let page = 1; page <= totalPages; page++) {
      let pageUrl = `https://api.truckershub.in/v1/jobs?page=${page}`;
      if (month && year) {
        pageUrl += `&month=${month}&year=${year}`;
      }

      const res = await axios.get(pageUrl);

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
