import { ApiClient } from "../src";

async function main(): Promise<void> {
  const client = new ApiClient({
    baseUrl: "https://api.example.com/v1",
    auth: {
      type: "apiKey",
      apiKey: process.env.YOUR_ORG_API_KEY ?? ""
    },
    timeoutMs: 15_000,
    retry: {
      maxRetries: 3
    }
  });

  const users = await client.users.list({ limit: 10 });
  console.log(users.items);
}

void main();
