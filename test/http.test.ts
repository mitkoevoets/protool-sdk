import { describe, expect, it, vi } from "vitest";
import type { ApiError } from "../src/errors";
import { HttpClient } from "../src/http";

function mockResponse(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {}
): Response {
  return new Response(body === undefined ? undefined : JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

describe("HttpClient", () => {
  it("attaches bearer auth header", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () =>
      mockResponse({ ok: true })
    );
    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      auth: { type: "bearer", token: "token-123" },
      fetch: fetchMock as typeof fetch
    });

    await client.request({ method: "GET", path: "/health" });
    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const request = (firstCall?.[1] ?? {}) as RequestInit;
    const headers = request.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer token-123");
  });

  it("maps non-2xx responses to ApiError", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () =>
      mockResponse(
        { message: "Invalid request", code: "bad_request" },
        { status: 400, headers: { "x-request-id": "req_123" } }
      )
    );
    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as typeof fetch,
      retry: { maxRetries: 0 }
    });

    await expect(client.request({ method: "GET", path: "/users" })).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      code: "bad_request",
      requestId: "req_123"
    } satisfies Partial<ApiError>);
  });
});
