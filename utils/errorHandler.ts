import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "@/i18n";
import { getDictionary } from "@/app/i18n";

const LOG_FILE = path.join(process.cwd(), "logs", "errors.log");

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
  request?: Request,
  locale: Locale = "en",
  statusCode: number = 500,
) {
  let logMessage: string;
  let responseMessage: string;
  let errorName: string;

  if (error instanceof Error) {
    logMessage = `${error.name}: ${error.message}`;
    responseMessage = error.message;
    errorName = statusToErrorName[statusCode] || error.name;
  } else if (typeof error === "string") {
    logMessage = error;
    responseMessage = error;
    errorName = statusToErrorName[statusCode] || "Error";
  } else if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    logMessage = JSON.stringify(error, null, 2);
    responseMessage = errorObj.error ? String(errorObj.error) : JSON.stringify(error);
    errorName = statusToErrorName[statusCode] || (errorObj.name ? String(errorObj.name) : "Error");
  } else {
    logMessage = String(error);
    responseMessage = String(error);
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

  const logEntry = `
[${formatTimestamp(new Date())}]
URL: ${request?.url ?? "NO URL"}
Method: ${request?.method ?? "UNKNOWN"}
Status: ${statusCode}
Error: ${errorName}
Message: ${logMessage}
Locale: ${locale}
-----------------------------
`;

  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.appendFile(LOG_FILE, logEntry, "utf8");

  const dict = await getDictionary(locale);
  const errorCodeKey = statusToErrorName[statusCode];
  // const translatedErrorName = errorCodeKey ? dict.statusCodes[errorCodeKey] : "Error";
  const translatedErrorName =
      errorCodeKey && errorCodeKey in dict.statusCodes
          ? dict.statusCodes[errorCodeKey as keyof typeof dict.statusCodes]
          : "Error";

  return NextResponse.json(
    {
      method: request?.method ?? "UNKNOWN",
      status: statusCode,
      error: translatedErrorName,
      message: responseMessage,
      lang: locale,
      // logMessage: logMessage,
    },
    { status: statusCode },
  );
}
