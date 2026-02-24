import { NextResponse } from "next/server";
import { errorHandler } from "@/utils/errorHandler";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const res = await axios.get("https://api.truckersmp.com/v2/vtc/74455/events/attending");

    if (res.status !== 200) {
      return errorHandler({ error: "Failed to fetch events" }, request, res.status);
    }

    const data = res.data;
    return NextResponse.json(data);
  } catch (err) {
    return errorHandler(err, request);
  }
}
