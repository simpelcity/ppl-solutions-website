import { NextResponse } from "next/server";
import axios from "axios";
import { getDictionary } from "@/app/i18n";
import { getLocaleFromRequest } from "@/utils/getLocaleFromRequest";

axios.defaults.headers.common["Authorization"] = process.env.TRUCKERSHUB_API_TOKEN;
axios.defaults.headers.common["Content-Type"] = "application/json";

export async function GET(request: Request) {
  try {
    const lang = getLocaleFromRequest(request);
    const dict = await getDictionary(lang);

    const res = await axios.get("https://api.truckershub.in/v1/drivers");

    if (res.status !== 200) {
      return NextResponse.json({ error: "Failed to fetch members" }, { status: res.status });
    }

    const data = await res.data;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
