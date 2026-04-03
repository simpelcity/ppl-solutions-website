import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { errorHandler } from "@/utils/errorHandler";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

axios.defaults.headers.common["Authorization"] = process.env.TRUCKERSHUB_API_TOKEN;
axios.defaults.headers.common["Content-Type"] = "application/json";

export async function POST(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const body = await request.json();
    const { steamID, page } = body;

    if (!steamID) return errorHandler({ error: dict.errors.jobs.STEAM_ID_REQUIRED }, request, lang, 400);

    const res = await axios.get(`https://api.truckershub.in/v1/drivers/${steamID}/jobs?page=${page}`);

    if (res.status !== 200) return errorHandler({ error: dict.errors.jobs.FAILED_TO_FETCH_JOBS }, request, lang, res.status);

    const data = await res.data;
    return NextResponse.json({ jobs: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.jobs.FAILED_TO_FETCH_JOBS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
