import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import { errorHandler } from "./errorHandler";

// Mock fs/promises
vi.mock("fs/promises", async () => {
  return {
    default: {
      mkdir: vi.fn(),
      appendFile: vi.fn(),
    },
  };
});

describe("errorHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a 500 response and logs the error", async () => {
    const error = new Error("Test failure");
    const request = new Request("http://localhost/api/statistics", {
      method: "GET",
    });

    const response = await errorHandler(error, request);

    // ✅ Response assertions
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });

    // ✅ File system assertions
    expect(fs.mkdir).toHaveBeenCalledTimes(1);
    expect(fs.appendFile).toHaveBeenCalledTimes(1);

    
  });
});
