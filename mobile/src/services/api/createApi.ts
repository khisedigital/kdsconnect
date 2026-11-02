import { appConfig, type AppConfig } from '../../config';
import { getTokens } from '../storage';
import { createAuthApi, createDevAuthApi, type AuthApi } from './authApi';
import { createGroupBuyingApi, createDevGroupBuyingApi, type GroupBuyingApi } from './groupBuyingApi';
import { createHttpClient } from './httpClient';
import { createNotificationsApi, createDevNotificationsApi, type NotificationsApi } from './notificationsApi';
import { createOrdersApi, createDevOrdersApi, type OrdersApi } from './ordersApi';
import { createProductsApi, createDevProductsApi, type ProductsApi } from './productsApi';
import { createProfileApi, createDevProfileApi, type ProfileApi } from './profileApi';
import { createQuotationsApi, createDevQuotationsApi, type QuotationsApi } from './quotationsApi';
import { createRfqsApi, createDevRfqsApi, type RfqsApi } from './rfqsApi';
import { createAdminApi, createDevAdminApi, type AdminApi } from './adminApi';
import {
  createBusinessVerificationApi,
  createDevBusinessVerificationApi,
  type BusinessVerificationApi,
} from './businessVerificationApi';
import { createKycApi, createDevKycApi, type KycApi } from './kycApi';
import { createSalesApi, createDevSalesApi, type SalesApi } from './salesApi';
import { createSupplierApi, createDevSupplierApi, type SupplierApi } from './supplierApi';
import {
  createSupportApi,
  createDevSupportApi,
  type SupportApi,
} from './supportApi';
export interface AppApi {
  auth: AuthApi;
  products: ProductsApi;
  rfqs: RfqsApi;
  quotations: QuotationsApi;
  groupBuying: GroupBuyingApi;
  orders: OrdersApi;
  notifications: NotificationsApi;
  profile: ProfileApi;
  supplier: SupplierApi;
  kyc: KycApi;
  businessVerification: BusinessVerificationApi;
  sales: SalesApi;
  admin: AdminApi;
  support: SupportApi;
}

function createProductionApi(config: AppConfig): AppApi {
  const client = createHttpClient({
    baseUrl: config.apiBaseUrl,
    timeoutMs: config.requestTimeoutMs,
    getAccessToken: async () => {
      const tokens = await getTokens();
      return tokens?.accessToken ?? null;
    },
    onUnauthorized: async () => {
      // TODO: call AUTH_ENDPOINTS.refresh when backend contract is confirmed.
      return null;
    },
  });

  return {
    auth: createAuthApi(client),
    products: createProductsApi(client),
    rfqs: createRfqsApi(client),
    quotations: createQuotationsApi(client),
    groupBuying: createGroupBuyingApi(client),
    orders: createOrdersApi(client),
    notifications: createNotificationsApi(client),
    profile: createProfileApi(client),
    supplier: createSupplierApi(client),
    kyc: createKycApi(client),
    businessVerification: createBusinessVerificationApi(client),
    sales: createSalesApi(client),
    admin: createAdminApi(client),
    support: createSupportApi(client),
  };
}

function createDevPreviewApi(): AppApi {
  const devOptions = { enableDevPreview: true as const };
  return {
    auth: createDevAuthApi(devOptions),
    products: createDevProductsApi(devOptions),
    rfqs: createDevRfqsApi(devOptions),
    quotations: createDevQuotationsApi(devOptions),
    groupBuying: createDevGroupBuyingApi(devOptions),
    orders: createDevOrdersApi(devOptions),
    notifications: createDevNotificationsApi(devOptions),
    profile: createDevProfileApi(devOptions),
    supplier: createDevSupplierApi(devOptions),
    kyc: createDevKycApi(devOptions),
    businessVerification: createDevBusinessVerificationApi(devOptions),
    sales: createDevSalesApi(devOptions),
    admin: createDevAdminApi(devOptions),
    support: createDevSupportApi(devOptions),
  };
}

export function createAppApi(config: AppConfig = appConfig): AppApi {
  if (config.enableDevPreview) {
    return createDevPreviewApi();
  }
  return createProductionApi(config);
}

let defaultApi: AppApi | null = null;

export function getAppApi(): AppApi {
  if (!defaultApi) {
    defaultApi = createAppApi();
  }
  return defaultApi;
}

/** Test override — resets singleton when config changes in tests. */
export function resetAppApiForTests(): void {
  defaultApi = null;
}
