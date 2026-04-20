import { describe, expect, it, vi } from "vitest";
import { ApiClient } from "../src/client";

describe("ApiClient endpoints", () => {
  it("builds expected company.search request", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () =>
      new Response(JSON.stringify({ data: [{ ID: "1", "Company Name": "BoldData" }] }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );

    const client = new ApiClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as typeof fetch
    });

    const response = await client.company.search({ countryCode: "NL", search: "BoldData", page: 1, pageSize: 25 });

    expect(response.data).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/company/search?countryCode=NL&search=BoldData&page=1&pageSize=25",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("builds expected lookup.cities request", async () => {
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () =>
      new Response(JSON.stringify({ data: [{ cityName: "AMSTERDAM", countryCode: "NL" }], total: 1, limit: 100 }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    );
    const client = new ApiClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as typeof fetch
    });

    const response = await client.lookup.cities({ search: "ams", countries: "NL", limit: 100 });
    expect(response.data[0]?.cityName).toBe("AMSTERDAM");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/cities?search=ams&countries=NL&limit=100",
      expect.objectContaining({ method: "GET" })
    );
  });
});
