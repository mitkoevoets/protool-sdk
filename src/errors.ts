import type { ApiErrorPayload } from "./types";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly requestId?: string;
  public readonly details?: unknown;
  public readonly rawBody?: unknown;

  constructor(args: {
    status: number;
    message: string;
    code?: string;
    requestId?: string;
    details?: unknown;
    rawBody?: unknown;
  }) {
    super(args.message);
    this.name = "ApiError";
    this.status = args.status;
    this.code = args.code;
    this.requestId = args.requestId;
    this.details = args.details;
    this.rawBody = args.rawBody;
  }
}

export function toApiError(status: number, requestId: string | null, body: unknown): ApiError {
  const payload = (body ?? {}) as ApiErrorPayload;
  return new ApiError({
    status,
    message: payload.message ?? `Request failed with status ${status}`,
    code: payload.code,
    requestId: requestId ?? undefined,
    details: payload.details,
    rawBody: body
  });
}
