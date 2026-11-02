import {
  ApiClientError,
  httpStatusToError,
  normalizeApiError,
  parseErrorBody,
} from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs: number;
  getAccessToken: () => Promise<string | null>;
  /**
   * Placeholder for refresh-token flow when backend contract is available.
   * Called when a request receives 401; should attempt refresh and return new access token or null.
   */
  onUnauthorized?: () => Promise<string | null>;
}

export interface RequestOptions {
  method?: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Used in error messages and contract-pending hints. */
  operation: string;
  skipAuth?: boolean;
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']): string {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export function createHttpClient(options: HttpClientOptions) {
  const { baseUrl, timeoutMs, getAccessToken, onUnauthorized } = options;

  async function request<T>(req: RequestOptions): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...req.headers,
      };

      if (req.body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }

      if (!req.skipAuth) {
        const token = await getAccessToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      let response = await fetch(buildUrl(baseUrl, req.path, req.query), {
        method: req.method ?? 'GET',
        headers,
        body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
        signal: controller.signal,
      });

      if (response.status === 401 && onUnauthorized && !req.skipAuth) {
        const refreshed = await onUnauthorized();
        if (refreshed) {
          headers.Authorization = `Bearer ${refreshed}`;
          response = await fetch(buildUrl(baseUrl, req.path, req.query), {
            method: req.method ?? 'GET',
            headers,
            body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
            signal: controller.signal,
          });
        }
      }

      if (!response.ok) {
        const body = await parseErrorBody(response);
        throw httpStatusToError(response.status, body, req.operation);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new ApiClientError({
          code: 'PARSE_ERROR',
          message: `Expected JSON response for ${req.operation}`,
        });
      }

      return (await response.json()) as T;
    } catch (error) {
      throw normalizeApiError(error, `Request failed: ${req.operation}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return { request };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
