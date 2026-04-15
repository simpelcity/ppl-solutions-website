import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

axios.defaults.headers.common["Authorization"] = process.env.TRUCKERSHUB_API_TOKEN;
axios.defaults.headers.common["Content-Type"] = "application/json";

export async function POST(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const { steamID } = body;

    if (!steamID) return errorHandler({ error: dict.errors.jobs.STEAM_ID_REQUIRED }, request, lang, 400);

    const firstRes = await axios.get(`https://api.truckershub.in/v1/drivers/${steamID}/jobs?page=1`);

    if (firstRes.status !== 200) return errorHandler({ error: dict.errors.jobs.FAILED_TO_FETCH_JOBS }, request, lang, firstRes.status);

    const firstData = await firstRes.data;

    const lastPageUrl = firstData.links?.last;
    const lastPageMatch = lastPageUrl?.match(/[?&]page=(\d+)/);
    const totalPages = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1;

    const allJobs: any[] = [];

    // Fetch all pages in parallel
    const pageRequests = [];
    for (let page = 1; page <= totalPages; page++) {
      pageRequests.push(
        axios.get(`https://api.truckershub.in/v1/drivers/${steamID}/jobs?page=${page}`)
      );
    }

    const responses = await Promise.all(pageRequests);

    responses.forEach((res) => {
      if (res.status === 200 && Array.isArray(res.data?.data)) {
        allJobs.push(...res.data.data);
      }
    });

    return NextResponse.json({
      jobs: allJobs.reverse(),
      meta: {
        total: allJobs.length,
        pages: totalPages,
      }
    }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.userStats.FAILED_TO_FETCH_STATS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}