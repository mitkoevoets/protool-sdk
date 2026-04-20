import { ApiClient } from "../src";

async function main(): Promise<void> {
  const client = new ApiClient({
    baseUrl: "https://app.companydata.com",
    auth: {
      type: "apiKey",
      apiKey: process.env.COMPANYDATA_API_KEY ?? ""
    },
    timeoutMs: 15_000,
    retry: {
      maxRetries: 3
    }
  });

  const searchResult = await client.company.search({
    countryCode: "NL",
    search: "BoldData",
    page: 1,
    pageSize: 25
  });
  console.log(searchResult.data);

  const cities = await client.lookup.cities({
    search: "ams",
    countries: "NL",
    limit: 100
  });
  console.log(cities.data[0]);
}

void main();
