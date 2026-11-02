import { ApiClientError } from './errors';

/**
 * Dev fixture APIs must only be constructed when dev preview is explicitly enabled.
 */
export function assertDevPreviewEnabled(enableDevPreview: boolean): void {
  if (!enableDevPreview) {
    throw new ApiClientError({
      code: 'NOT_IMPLEMENTED',
      message: 'Dev preview APIs are disabled. Set enableDevPreview only in local __DEV__ builds.',
    });
  }
}
