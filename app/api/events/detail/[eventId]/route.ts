import { NextResponse, NextRequest } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

type RouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const { eventId } = await params;

    if (!eventId) {
      return errorHandler({ error: dict.statusCodes.BAD_REQUEST }, request, lang, 400);
    }

    const res = await axios.get(`https://api.truckersmp.com/v2/events/${eventId}`);

    if (res.status !== 200) {
      return errorHandler({ error: dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS }, request, lang, res.status);
    }

    return NextResponse.json(res.data, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.events.details.FAILED_TO_FETCH_EVENT_DETAILS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}