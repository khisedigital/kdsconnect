import type { Order, PaginatedResponse, Product } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { SUPPLIER_ENDPOINTS } from './endpoints';
import { devDelay, devOrders, devProducts } from './fixtures';
import type { HttpClient } from './httpClient';

export interface SupplierDashboardSummary {
  openOrders: number;
  activeProducts: number;
  pendingRfqs: number;
}

export interface SupplierApi {
  getDashboard(): Promise<SupplierDashboardSummary>;
  listSupplierProducts(page?: number, pageSize?: number): Promise<PaginatedResponse<Product>>;
  listSupplierOrders(page?: number, pageSize?: number): Promise<PaginatedResponse<Order>>;
}

export function createSupplierApi(client: HttpClient): SupplierApi {
  return {
    getDashboard: () =>
      client.request<SupplierDashboardSummary>({
        path: SUPPLIER_ENDPOINTS.dashboard,
        method: 'GET',
        operation: 'supplier.dashboard',
      }),
    listSupplierProducts: (page = 1, pageSize = 20) =>
      client.request<PaginatedResponse<Product>>({
        path: SUPPLIER_ENDPOINTS.products,
        method: 'GET',
        query: { page, pageSize },
        operation: 'supplier.products',
      }),
    listSupplierOrders: (page = 1, pageSize = 20) =>
      client.request<PaginatedResponse<Order>>({
        path: SUPPLIER_ENDPOINTS.orders,
        method: 'GET',
        query: { page, pageSize },
        operation: 'supplier.orders',
      }),
  };
}

export function createDevSupplierApi(options: { enableDevPreview: boolean }): SupplierApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  return {
    async getDashboard() {
      await devDelay();
      return {
        openOrders: devOrders.length,
        activeProducts: devProducts.length,
        pendingRfqs: 1,
      };
    },
    async listSupplierProducts(page = 1, pageSize = 20) {
      await devDelay();
      return {
        items: devProducts,
        page,
        pageSize,
        totalItems: devProducts.length,
        totalPages: 1,
      };
    },
    async listSupplierOrders(page = 1, pageSize = 20) {
      await devDelay();
      return {
        items: devOrders,
        page,
        pageSize,
        totalItems: devOrders.length,
        totalPages: 1,
      };
    },
  };
}
