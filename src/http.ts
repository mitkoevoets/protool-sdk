import { ApiError, toApiError } from "./errors";
import type { ApiClientConfig, HttpMethod, QueryValue, RequestOptions, RetryConfig } from "./types";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRY_STATUSES = [429, 500, 502, 503, 504];

export interface HttpRequestConfig<TBody = unknown> {
  path: string;
  method: HttpMethod;
  body?: TBody;
  options?: RequestOptions;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly auth?: ApiClientConfig["auth"];
  private readonly timeoutMs: number;
  private readonly retry: Required<RetryConfig>;
  private readonly fetchImpl: typeof fetch;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.auth = config.auth;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = config.fetch ?? fetch;
    this.defaultHeaders = config.defaultHeaders ?? {};
    this.retry = {
      maxRetries: config.retry?.maxRetries ?? 2,
      baseDelayMs: config.retry?.baseDelayMs ?? 200,
      maxDelayMs: config.retry?.maxDelayMs ?? 2_000,
      retryOnStatuses: config.retry?.retryOnStatuses ?? DEFAULT_RETRY_STATUSES
    };
  }

  async request<TResponse, TBody = unknown>(request: HttpRequestConfig<TBody>): Promise<TResponse> {
    const url = this.buildUrl(request.path, request.options?.query);
    const headers = this.buildHeaders(request.options?.headers, request.options?.idempotencyKey);
    const init: RequestInit = {
      method: request.method,
      headers,
      body: request.body === undefined ? undefined : JSON.stringify(request.body)
    };

    const maxAttempts = this.retry.maxRetries + 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const mergedSignal = mergeSignals(controller.signal, request.options?.signal);
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await this.fetchImpl(url, { ...init, signal: mergedSignal });
        clearTimeout(timeout);

        if (!response.ok) {
          const body = await readResponseBody(response);
          const error = toApiError(response.status, response.headers.get("x-request-id"), body);

          if (this.shouldRetry(response.status, attempt, request.method)) {
            await delayWithJitter(attempt, this.retry.baseDelayMs, this.retry.maxDelayMs);
            lastError = error;
            continue;
          }
          throw error;
        }

        const parsedBody = await readResponseBody(response);
        return parsedBody as TResponse;
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
        if (!this.shouldRetryOnError(error, attempt, request.method)) {
          throw normalizeUnknownError(error);
        }
        await delayWithJitter(attempt, this.retry.baseDelayMs, this.retry.maxDelayMs);
      }
    }

    throw normalizeUnknownError(lastError);
  }

  private buildUrl(
    path: string,
    query?: Record<string, QueryValue>
  ): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);
    if (query) {
      appendQueryParams(url.searchParams, query);
    }
    return url.toString();
  }

  private buildHeaders(
    requestHeaders: Record<string, string> | undefined,
    idempotencyKey: string | undefined
  ): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...(requestHeaders ?? {})
    };

    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    if (this.auth?.type === "apiKey") {
      headers[this.auth.headerName ?? "x-api-key"] = this.auth.apiKey;
    }
    if (this.auth?.type === "bearer") {
      headers.Authorization = `Bearer ${this.auth.token}`;
    }
    return headers;
  }

  private shouldRetry(status: number, attempt: number, method: HttpMethod): boolean {
    if (attempt > this.retry.maxRetries) return false;
    const idempotent = method === "GET" || method === "PUT" || method === "DELETE";
    return idempotent && this.retry.retryOnStatuses.includes(status);
  }

  private shouldRetryOnError(error: unknown, attempt: number, method: HttpMethod): boolean {
    if (attempt > this.retry.maxRetries) return false;
    const idempotent = method === "GET" || method === "PUT" || method === "DELETE";
    if (!idempotent) return false;
    return !(error instanceof ApiError);
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function normalizeUnknownError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error("Unknown request failure");
}

function mergeSignals(primary: AbortSignal, secondary?: AbortSignal): AbortSignal {
  if (!secondary) return primary;
  const controller = new AbortController();
  const abort = (): void => controller.abort();
  if (primary.aborted || secondary.aborted) {
    controller.abort();
  } else {
    primary.addEventListener("abort", abort, { once: true });
    secondary.addEventListener("abort", abort, { once: true });
  }
  return controller.signal;
}

async function delayWithJitter(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number
): Promise<void> {
  const exponential = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  const jitter = Math.floor(Math.random() * 100);
  const delayMs = exponential + jitter;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

function appendQueryParams(
  searchParams: URLSearchParams,
  query: Record<string, QueryValue>,
  prefix?: string
): void {
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    appendQueryValue(searchParams, fullKey, value);
  }
}

function appendQueryValue(searchParams: URLSearchParams, key: string, value: QueryValue): void {
  if (value === undefined || value === null) return;

  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryValue(searchParams, key, item);
    }
    return;
  }

  if (typeof value === "object") {
    appendQueryParams(searchParams, value as Record<string, QueryValue>, key);
    return;
  }

  searchParams.append(key, String(value));
}
