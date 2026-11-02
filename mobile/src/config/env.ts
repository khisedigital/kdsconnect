/**
 * Application configuration (typed AppConfig).
 *
 * Production release builds MUST set `enableDevPreview` to `false`.
 * Dev preview fixtures must never ship enabled in store builds.
 */

export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  /** Base URL for REST API (no trailing slash). */
  apiBaseUrl: string;
  environment: Environment;
  /**
   * When true, API factory uses isolated dev fixtures instead of live HTTP.
   * Default: true only when `__DEV__` and environment is `development`.
   */
  enableDevPreview: boolean;
  requestTimeoutMs: number;
}

const configByEnvironment: Record<Environment, Omit<AppConfig, 'enableDevPreview'>> = {
  development: {
    apiBaseUrl: 'https://api-dev.kdsconnect.example/v1',
    environment: 'development',
    requestTimeoutMs: 30_000,
  },
  staging: {
    apiBaseUrl: 'https://api-staging.kdsconnect.example/v1',
    environment: 'staging',
    requestTimeoutMs: 30_000,
  },
  production: {
    apiBaseUrl: 'https://api.kdsconnect.example/v1',
    environment: 'production',
    requestTimeoutMs: 30_000,
  },
};

/** Override for local testing; defaults from build mode. */
const ACTIVE_ENVIRONMENT: Environment = __DEV__ ? 'development' : 'production';

const base = configByEnvironment[ACTIVE_ENVIRONMENT];

export const appConfig: AppConfig = {
  ...base,
  enableDevPreview: ACTIVE_ENVIRONMENT === 'development' && __DEV__,
};

/** @deprecated Use `appConfig.enableDevPreview` — alias for factory docs. */
export const devPreviewMode = appConfig.enableDevPreview;
