# @companydata/protool-sdk

TypeScript SDK for integrating with the CompanyData ProTool API from Node.js and browser environments.

## Installation

```bash
npm install @companydata/protool-sdk
```

## Quickstart

```ts
import { ApiClient } from "@companydata/protool-sdk";

const client = new ApiClient({
  baseUrl: "https://app.companydata.com",
  auth: { type: "apiKey", apiKey: process.env.COMPANYDATA_API_KEY! }
});

const result = await client.company.search({
  countryCode: "NL",
  search: "BoldData",
  page: 1,
  pageSize: 25
});

console.log(result.data);
```

## Endpoints

The SDK maps to these public API endpoints:

- `client.company.search()` -> `GET /api/company/search`
- `client.company.export()` -> `GET /api/company/export` (standard pagination)
- `client.company.exportWithScroll()` -> `GET /api/company/export` with `useScroll=true`
- `client.lookup.cities()` -> `GET /api/cities`
- `client.lookup.provinces()` -> `GET /api/provinces`
- `client.lookup.regions()` -> `GET /api/regions`
- `client.lookup.countries()` -> `GET /api/countries`

## Company Export (scroll mode)

```ts
let page = await client.company.exportWithScroll({
  countryCode: "NL",
  pageSize: 1000
});

while (page.hasMoreRecords) {
  // process page.data
  page = await client.company.exportWithScroll({
    scrollId: page.scrollId,
    pageSize: 1000
  });
}
```

## Lookup Example

```ts
const cities = await client.lookup.cities({
  search: "ams",
  countries: "NL",
  limit: 100
});
console.log(cities.data);
```

## Error Handling

```ts
import { ApiError } from "@companydata/protool-sdk";

try {
  await client.company.search({ countryCode: "NL", search: "BoldData" });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.code, error.requestId);
  }
}
```

## Configuration

```ts
const client = new ApiClient({
  baseUrl: "https://app.companydata.com",
  auth: { type: "apiKey", apiKey: process.env.COMPANYDATA_API_KEY! },
  timeoutMs: 10_000,
  retry: {
    maxRetries: 2,
    baseDelayMs: 200,
    maxDelayMs: 2_000,
    retryOnStatuses: [429, 500, 502, 503, 504]
  }
});
```

## Scripts

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Release

Publish from the package directory:

- `npm run pack:check`
- `npm run publish:public`
