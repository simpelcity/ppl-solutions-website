import { NextRequest, NextResponse } from "next/server";
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

    if (!steamID) return NextResponse.json({ error: "steamID is required" }, { status: 400 });

    const res = await axios.get(`https://api.truckershub.in/v1/drivers/${steamID}/scenarios`);

    if (res.status !== 200) {
      return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: res.status });
    }

    const data = await res.data;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
