import { describe, expect, it, vi } from "vitest";
import { ApiClient } from "../src/client";

describe("ApiClient endpoints", () => {
  it("builds expected users.getById request", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () =>
      new Response(JSON.stringify({ id: "u1", email: "test@example.com" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );

    const client = new ApiClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as typeof fetch
    });

    const user = await client.users.getById("u1");

    expect(user.id).toBe("u1");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/users/u1",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("sends idempotency key for project archive", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () =>
      new Response(JSON.stringify({ id: "p1", name: "Project", status: "archived" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );
    const client = new ApiClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as typeof fetch
    });

    await client.projects.archive("p1");
    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const request = (firstCall?.[1] ?? {}) as RequestInit;
    const headers = request.headers as Record<string, string>;

    expect(headers["Idempotency-Key"]).toBe("archive-p1");
  });
});
