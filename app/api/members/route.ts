import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";
import axios from "axios";

axios.defaults.headers.common["Authorization"] = process.env.TRUCKERSHUB_API_TOKEN;
axios.defaults.headers.common["Content-Type"] = "application/json";

export async function GET(request: NextRequest) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const res = await axios.get("https://api.truckershub.in/v1/drivers");

    if (res.status !== 200) return errorHandler({ error: dict.errors.drivers.FAILED_TO_FETCH_DRIVERS }, request, lang, res.status);

    const data = res.data.data;
    return NextResponse.json({ members: data }, { status: 200 });
  } catch (err: any) {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);
    const serverMessage = err?.response?.data?.message || err?.message;
    const message = dict.errors.drivers.FAILED_TO_FETCH_DRIVERS;
    return errorHandler({ error: message, serverError: serverMessage }, request, lang, 500);
  }
}
