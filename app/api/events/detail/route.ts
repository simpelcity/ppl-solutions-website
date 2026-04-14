import { NextResponse, NextRequest } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const res = await axios.get(`https://api.truckersmp.com/v2/events/${request.nextUrl.searchParams.get("eventId")}`);

    if (res.status !== 200) return errorHandler({ error: dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS }, request, lang, res.status);

    const data = res.data;
    return NextResponse.json(data);
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}