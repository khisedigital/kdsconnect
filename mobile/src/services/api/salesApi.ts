import type {
  OnboardedAccount,
  OnboardRetailerBySalesRequest,
  OnboardWholesalerBySalesRequest,
  SalesDashboardSummary,
} from '../../types';
import {assertDevPreviewEnabled} from './devOnlyGuard';
import {SALES_ENDPOINTS} from './endpoints';
import {devDelay, getCurrentDevUser} from './fixtures';
import type {HttpClient} from './httpClient';
import {ApiClientError} from './errors';

export interface SalesApi {
  getDashboard(): Promise<SalesDashboardSummary>;
  listOnboardedAccounts(): Promise<OnboardedAccount[]>;
  onboardRetailer(
    payload: OnboardRetailerBySalesRequest,
  ): Promise<OnboardedAccount>;
  onboardWholesaler(
    payload: OnboardWholesalerBySalesRequest,
  ): Promise<OnboardedAccount>;
}

export function createSalesApi(client: HttpClient): SalesApi {
  return {
    getDashboard: () =>
      client.request<SalesDashboardSummary>({
        path: SALES_ENDPOINTS.dashboard,
        method: 'GET',
        operation: 'sales.dashboard',
      }),
    listOnboardedAccounts: () =>
      client.request<OnboardedAccount[]>({
        path: SALES_ENDPOINTS.accounts,
        method: 'GET',
        operation: 'sales.accounts',
      }),
    onboardRetailer: payload =>
      client.request<OnboardedAccount>({
        path: SALES_ENDPOINTS.onboardRetailer,
        method: 'POST',
        body: payload,
        operation: 'sales.onboardRetailer',
      }),
    onboardWholesaler: payload =>
      client.request<OnboardedAccount>({
        path: SALES_ENDPOINTS.onboardWholesaler,
        method: 'POST',
        body: payload,
        operation: 'sales.onboardWholesaler',
      }),
  };
}

function summarize(accounts: OnboardedAccount[]): SalesDashboardSummary {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const retailers = accounts.filter(a => a.kind === 'retailer');
  const wholesalers = accounts.filter(a => a.kind === 'supplier');
  return {
    retailersOnboarded: retailers.length,
    wholesalersOnboarded: wholesalers.length,
    totalOnboarded: accounts.length,
    onboardedThisWeek: accounts.filter(
      a => new Date(a.onboardedAt).getTime() >= weekAgo,
    ).length,
    pendingKyc: accounts.filter(a => a.status === 'pending_kyc').length,
  };
}

export function createDevSalesApi(options: {
  enableDevPreview: boolean;
}): SalesApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  const seedSalesId = 'dev-user-sales-1';
  const now = Date.now();
  let accounts: OnboardedAccount[] = [
    {
      id: 'ob-ret-1',
      kind: 'retailer',
      displayName: 'Anita Stores',
      businessName: 'Anita Kirana',
      email: 'anita@retail.dev',
      phone: '+91 98765 10001',
      city: 'Pune',
      onboardedAt: new Date(now - 2 * 86400000).toISOString(),
      onboardedBySalesId: seedSalesId,
      status: 'active',
    },
    {
      id: 'ob-ret-2',
      kind: 'retailer',
      displayName: 'City Mart',
      businessName: 'City Mart Pvt Ltd',
      email: 'ops@citymart.dev',
      city: 'Nashik',
      onboardedAt: new Date(now - 10 * 86400000).toISOString(),
      onboardedBySalesId: seedSalesId,
      status: 'pending_kyc',
    },
    {
      id: 'ob-sup-1',
      kind: 'supplier',
      displayName: 'Ravi Trading',
      businessName: 'Ravi Wholesale Spices',
      email: 'ravi@wholesale.dev',
      city: 'Mumbai',
      onboardedAt: new Date(now - 1 * 86400000).toISOString(),
      onboardedBySalesId: seedSalesId,
      status: 'active',
    },
    {
      id: 'ob-sup-2',
      kind: 'supplier',
      displayName: 'Grain Hub',
      businessName: 'Grain Hub Distributors',
      email: 'sales@grainhub.dev',
      city: 'Nagpur',
      onboardedAt: new Date(now - 20 * 86400000).toISOString(),
      onboardedBySalesId: seedSalesId,
      status: 'invited',
    },
  ];

  return {
    async getDashboard() {
      await devDelay();
      return summarize(accounts);
    },
    async listOnboardedAccounts() {
      await devDelay();
      return accounts.map(item => ({...item}));
    },
    async onboardRetailer(payload) {
      await devDelay();
      if (!payload.email.includes('@') || payload.password.length < 4) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Enter a valid email and password (min 4 chars in preview).',
        });
      }
      const salesId = getCurrentDevUser().id;
      const created: OnboardedAccount = {
        id: `ob-ret-${Date.now()}`,
        kind: 'retailer',
        displayName: payload.displayName.trim(),
        businessName: payload.businessName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim(),
        city: payload.city?.trim(),
        onboardedAt: new Date().toISOString(),
        onboardedBySalesId: salesId,
        status: 'pending_kyc',
      };
      accounts = [created, ...accounts];
      return {...created};
    },
    async onboardWholesaler(payload) {
      await devDelay();
      if (!payload.email.includes('@') || payload.password.length < 4) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Enter a valid email and password (min 4 chars in preview).',
        });
      }
      const salesId = getCurrentDevUser().id;
      const created: OnboardedAccount = {
        id: `ob-sup-${Date.now()}`,
        kind: 'supplier',
        displayName: payload.displayName.trim(),
        businessName: payload.companyName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim(),
        city: payload.city?.trim(),
        onboardedAt: new Date().toISOString(),
        onboardedBySalesId: salesId,
        status: 'pending_kyc',
      };
      accounts = [created, ...accounts];
      return {...created};
    },
  };
}
