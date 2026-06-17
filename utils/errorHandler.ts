import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "@/i18n";
import { getDictionary } from "@/app/i18n";
import axios from "axios";

// const LOG_FILE = path.join(process.cwd(), "logs", "errors.log");

const statusToErrorName: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
};

export async function errorHandler(
  error: unknown,
  request: Request,
  locale: Locale = "en",
  statusCode: number = 500,
  options?: {
    [key: string]: any;
  }
) {
  let logMessage: string;
  let responseMessage: string;
  let errorName: string;

  if (error && typeof error === "object" && ("serverError" in error || "error" in error)) {
    // error: message for user, serverError: for server log
    const errorObj = error as Record<string, unknown>;
    responseMessage = errorObj.error ? String(errorObj.error) : "An unexpected error occurred.";
    logMessage = errorObj.serverError
      ? `${errorObj.serverError}`
      : errorObj.error
        ? `${errorObj.error}`
        : JSON.stringify(error);
    errorName = statusToErrorName[statusCode] || (errorObj.name ? String(errorObj.name) : "Error");
  } else if (error instanceof Error) {
    responseMessage = "An unexpected error occurred.";
    logMessage = `${error.name}: ${error.message}`;
    errorName = statusToErrorName[statusCode] || error.name;
  } else if (typeof error === "string") {
    responseMessage = "An unexpected error occurred.";
    logMessage = error;
    errorName = statusToErrorName[statusCode] || "Error";
  } else {
    responseMessage = "An unexpected error occurred.";
    logMessage = String(error);
    errorName = statusToErrorName[statusCode] || "Error";
  }

  function formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = pad(date.getDate());
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? "+" : "-";
    const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const tzMinutes = pad(Math.abs(tzOffset) % 60);
    return `${day}-${month}-${year}:${hours}:${minutes}:${seconds} ${sign}${tzHours}${tzMinutes}`;
  }

  function toUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  const logEntry = `
[${formatTimestamp(new Date())}]
URL: ${request?.url ?? "NO URL"}
Method: ${request?.method ?? "UNKNOWN"}
Status: ${statusCode}
Error: ${errorName}
Message: ${logMessage}
-----------------------------
`;

  const payload = {
    embeds: [
      {
        title: 'New Dashboard Error',
        url: 'https://ppl-solutions.vercel.app/drivershub/dashboard',
        description: `
**<t:${toUnixTimestamp(new Date())}:F>**
URL: ${request?.url ?? "NO URL"}
Method: ${request?.method ?? "UNKNOWN"}
Status: ${statusCode}
Error: ${errorName}
Message: ${logMessage}
-----------------------------
          `,
        color: 0x009a86,
        author: {
          name: 'PPL Solutions VTC Error Logger',
          icon_url: 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png',
        }
      }
    ]
  };

  const dict = await getDictionary(locale);

  let domain;
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:8000';
  } else {
    domain = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : 'https://ppl-solutions.vercel.app';
  }

  try {
    const res = await axios.post(`${domain}/api/discord-webhook?messageType=error`, {
      ...payload,
    });

    if (res.status !== 200) throw new Error(dict.errors.dashboard.hook.error.FAILED_TO_SEND_ERROR_DATA);

  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || dict.errors.dashboard.hook.error.FAILED_TO_SEND_ERROR_DATA;
    console.error(`Failed to send error log to Discord: ${message}`);
    throw err;
  }

  // await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  // await fs.appendFile(LOG_FILE, logEntry, "utf8");
  console.error(logEntry);

  const errorCodeKey = statusToErrorName[statusCode];
  // const translatedErrorName = errorCodeKey ? dict.statusCodes[errorCodeKey] : "Error";
  const translatedErrorName =
      errorCodeKey && errorCodeKey in dict.statusCodes
          ? dict.statusCodes[errorCodeKey as keyof typeof dict.statusCodes]
          : "Error";

  return NextResponse.json(
    {

      error: true,
      message: responseMessage,
      // method: request?.method ?? "UNKNOWN",
      // status: statusCode,
    },
    { status: statusCode },
  );
}
