import fs from "fs/promises";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "logs", "errors.log");

const statusToErrorName: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

export async function errorHandler(
  error: unknown,
  request?: Request,
  statusCode: number = 500
) {
  let logMessage: string;
  let responseMessage: string;
  let errorName: string;
  
  if (error instanceof Error) {
    logMessage = `${error.name}: ${error.message}\n${error.stack}`;
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

  const logEntry = `
  [${new Date().toISOString()}]
  URL: ${request?.url ?? "NO URL"}
  Method: ${request?.method ?? "UNKNOWN"}
  Status: ${statusCode}
  Error Name: ${errorName}
  Message: ${logMessage}
  -----------------------------
  `;

  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.appendFile(LOG_FILE, logEntry, "utf8");

  return new Response(
    JSON.stringify({
      error: errorName,
      message: responseMessage,
      status: statusCode,
    }),
    { status: statusCode, headers: { "Content-Type": "application/json" } }
  );
}