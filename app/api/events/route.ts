import { NextResponse } from "next/server"
import { errorHandler } from "@/utils/errorHandler"

export async function GET(request: Request) {
  try {
    const response = await fetch(
      "https://api.truckersmp.com/v2/vtc/74455/events/attending"
    )

    if (!response.ok) {
      return errorHandler(
        { error: "Failed to fetch events" },
        request,
        response.status
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    return errorHandler(err, request)
  }
}
