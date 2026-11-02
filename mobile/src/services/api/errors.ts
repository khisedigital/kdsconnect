import type { ApiError, ApiErrorBody } from '../../types';

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'PARSE_ERROR'
  | 'HTTP_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

export class ApiClientError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly details?: Record<string, unknown>;

  constructor(params: {
    code: ApiErrorCode;
    message: string;
    status?: number;
    details?: Record<string, unknown>;
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

export function contractPendingError(operation: string): ApiClientError {
  return new ApiClientError({
    code: 'NOT_IMPLEMENTED',
    status: 501,
    message: `Backend API contract pending for "${operation}". See docs/API_CONTRACTS.md.`,
  });
}

export function normalizeApiError(error: unknown, fallbackMessage?: string): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return new ApiClientError({
        code: 'TIMEOUT',
        message: 'Request timed out',
      });
    }
    const message = error.message || fallbackMessage || 'Network request failed';
    if (message.includes('Network request failed') || message.includes('Failed to fetch')) {
      return new ApiClientError({
        code: 'NETWORK_ERROR',
        message:
          'Unable to reach the API. Backend contracts and deployment are pending — see docs/API_CONTRACTS.md.',
        details: { cause: message },
      });
    }
    return new ApiClientError({
      code: 'UNKNOWN',
      message,
    });
  }

  return new ApiClientError({
    code: 'UNKNOWN',
    message: fallbackMessage ?? 'An unexpected error occurred',
  });
}

export async function parseErrorBody(response: Response): Promise<ApiErrorBody | undefined> {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return undefined;
  }
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body;
  } catch {
    return undefined;
  }
}

export function httpStatusToError(
  status: number,
  body: ApiErrorBody | undefined,
  operation: string,
): ApiClientError {
  if (status === 401) {
    return new ApiClientError({
      code: 'UNAUTHORIZED',
      status,
      message: body?.message ?? 'Unauthorized',
      details: body?.details,
    });
  }
  if (status === 501 || status === 404) {
    return contractPendingError(operation);
  }
  return new ApiClientError({
    code: 'HTTP_ERROR',
    status,
    message: body?.message ?? `HTTP ${status} for ${operation}`,
    details: body?.details,
  });
}
