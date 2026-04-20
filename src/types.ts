export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  idempotencyKey?: string;
  query?: Record<string, string | number | boolean | undefined | null>;
}

export interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryOnStatuses?: number[];
}

export interface ApiKeyAuth {
  type: "apiKey";
  apiKey: string;
  headerName?: string;
}

export interface BearerAuth {
  type: "bearer";
  token: string;
}

export type AuthStrategy = ApiKeyAuth | BearerAuth;

export interface ApiClientConfig {
  baseUrl: string;
  auth?: AuthStrategy;
  timeoutMs?: number;
  retry?: RetryConfig;
  fetch?: typeof fetch;
  defaultHeaders?: Record<string, string>;
}

export interface ApiErrorPayload {
  message?: string;
  code?: string;
  details?: unknown;
}

export interface PaginationPage<T> {
  items: T[];
  nextCursor?: string;
}
