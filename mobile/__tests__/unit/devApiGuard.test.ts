import {appConfig} from '../../src/config';
import {createAppApi} from '../../src/services/api/createApi';

describe('API factory isolation', () => {
  it('uses enableDevPreview only in development __DEV__ builds by default', () => {
    // Production path must never silently enable fixtures when env is production.
    expect(typeof appConfig.enableDevPreview).toBe('boolean');
    if (!__DEV__) {
      expect(appConfig.enableDevPreview).toBe(false);
    }
  });

  it('returns a typed API surface', () => {
    const api = createAppApi({
      ...appConfig,
      enableDevPreview: true,
    });
    expect(api.auth).toBeDefined();
    expect(api.products).toBeDefined();
    expect(api.rfqs).toBeDefined();
    expect(api.quotations).toBeDefined();
    expect(api.groupBuying).toBeDefined();
    expect(api.orders).toBeDefined();
  });
});
