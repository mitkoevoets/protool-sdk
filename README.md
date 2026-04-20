# @companydata/protool-sdk

TypeScript SDK for integrating with the ProTool API from Node.js and browser environments.

## Installation

```bash
npm install @companydata/protool-sdk
```

## Quickstart

```ts
import { ApiClient } from "@companydata/protool-sdk";

const client = new ApiClient({
  baseUrl: "https://api.example.com/v1",
  auth: { type: "apiKey", apiKey: process.env.COMPANYDATA_API_KEY! }
});

const user = await client.users.getById("usr_123");
console.log(user.email);
```

## Configuration

```ts
const client = new ApiClient({
  baseUrl: "https://api.example.com/v1",
  auth: { type: "bearer", token: "token-value" },
  timeoutMs: 10000,
  retry: {
    maxRetries: 2,
    baseDelayMs: 200,
    maxDelayMs: 2000,
    retryOnStatuses: [429, 500, 502, 503, 504]
  }
});
```

## Error Handling

All non-2xx responses throw an `ApiError` with normalized metadata.

```ts
import { ApiError } from "@companydata/protool-sdk";

try {
  await client.projects.archive("proj_123");
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.code, error.requestId);
  }
}
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
