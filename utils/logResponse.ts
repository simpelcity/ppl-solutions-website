import fs from "fs/promises";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
import { AxiosRequestConfig } from "axios";

const LOG_FILE = path.join(process.cwd(), "logs/api", "api.log");

export async function logApiResponse(request: any) {
  console.log(request);
  let logMessage: string;
  let response: any;
  let status: number | string = "N/A";
  let method: string = "N/A";
  let url: string = "N/A";

  logMessage = `[${new Date().toLocaleDateString("en-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}]`;

  try {
    logMessage += ` - Response: ${JSON.stringify(request.data || request, null, 2)}`;
  } catch (err) {
    logMessage += ` - Error processing response: ${err instanceof Error ? err.message : String(err)}`;
  }

  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.appendFile(LOG_FILE, logMessage + "\n", "utf8");
  // const response = await fetch(url);
  // const data = await response.json();
  // await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
