import { NextResponse, NextRequest } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

async function methodNotAllowed(request: NextRequest) {
  const lang = getLocaleFromRequest(request);
  const dict = await getDictionary(lang);
  return errorHandler({ error: dict.statusCodes.METHOD_NOT_ALLOWED }, request, lang, 405);
}

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const res = await axios.get("https://api.truckersmp.com/v2/vtc/74455/events/attending");

    if (res.status !== 200) return errorHandler({ error: dict.errors.events.FAILED_TO_FETCH_EVENTS }, request, lang, res.status);

    const data = res.data;
    return NextResponse.json(data);
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.events.FAILED_TO_FETCH_EVENTS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}

export async function POST(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function PUT(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function PATCH(request: NextRequest) {
  return methodNotAllowed(request);
}

export async function DELETE(request: NextRequest) {
  return methodNotAllowed(request);
}
