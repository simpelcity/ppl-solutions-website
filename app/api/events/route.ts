import { NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

export async function GET(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const res = await axios.get("https://api.truckersmp.com/v2/vtc/74455/events/attending");

    if (res.status !== 200) {
      return errorHandler({ error: dict.events.errors.FAILED_TO_FETCH_EVENTS }, request, lang, res.status);
    }

    const data = res.data;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return errorHandler(err, request);
  }
}
