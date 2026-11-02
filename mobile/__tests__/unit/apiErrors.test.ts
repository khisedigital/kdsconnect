import {ApiClientError, normalizeApiError} from '../../src/services/api/errors';

describe('normalizeApiError', () => {
  it('passes through ApiClientError instances', () => {
    const err = new ApiClientError({
      code: 'UNAUTHORIZED',
      message: 'Session expired',
      status: 401,
    });
    const normalized = normalizeApiError(err);
    expect(normalized.code).toBe('UNAUTHORIZED');
    expect(normalized.status).toBe(401);
  });

  it('normalizes unknown errors', () => {
    const normalized = normalizeApiError(new Error('boom'));
    expect(normalized.message).toContain('boom');
    expect(normalized.code).toBe('UNKNOWN');
  });
});
