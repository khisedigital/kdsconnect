import type { Order, PaginatedResponse } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { ORDER_ENDPOINTS } from './endpoints';
import { devDelay, devOrders } from './fixtures';
import type { HttpClient } from './httpClient';
import { ApiClientError } from './errors';

export interface CreateOrderPayload {
  supplierId: string;
  items: Array<{ productId: string; quantity: number }>;
}

export interface OrdersApi {
  listOrders(page?: number, pageSize?: number): Promise<PaginatedResponse<Order>>;
  getOrder(id: string): Promise<Order>;
  createOrder(payload: CreateOrderPayload): Promise<Order>;
  cancelOrder(id: string): Promise<Order>;
}

export function createOrdersApi(client: HttpClient): OrdersApi {
  return {
    listOrders: (page = 1, pageSize = 20) =>
      client.request<PaginatedResponse<Order>>({
        path: ORDER_ENDPOINTS.list,
        method: 'GET',
        query: { page, pageSize },
        operation: 'orders.list',
      }),
    getOrder: id =>
      client.request<Order>({
        path: ORDER_ENDPOINTS.detail(id),
        method: 'GET',
        operation: 'orders.detail',
      }),
    createOrder: payload =>
      client.request<Order>({
        path: ORDER_ENDPOINTS.create,
        method: 'POST',
        body: payload,
        operation: 'orders.create',
      }),
    cancelOrder: id =>
      client.request<Order>({
        path: ORDER_ENDPOINTS.cancel(id),
        method: 'POST',
        operation: 'orders.cancel',
      }),
  };
}

export function createDevOrdersApi(options: { enableDevPreview: boolean }): OrdersApi {
  assertDevPreviewEnabled(options.enableDevPreview);
  const store = [...devOrders];

  return {
    async listOrders(page = 1, pageSize = 20) {
      await devDelay();
      return {
        items: store,
        page,
        pageSize,
        totalItems: store.length,
        totalPages: 1,
      };
    },
    async getOrder(id) {
      await devDelay();
      const order = store.find(o => o.id === id);
      if (!order) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture order not found' });
      }
      return order;
    },
    async createOrder(payload) {
      await devDelay();
      const order: Order = {
        id: `order-dev-${Date.now()}`,
        retailerId: 'dev-user-retailer-1',
        supplierId: payload.supplierId,
        status: 'pending',
        items: payload.items.map((item, index) => ({
          id: `order-item-${index}`,
          productId: item.productId,
          productName: `Product ${item.productId}`,
          quantity: item.quantity,
          unitPrice: { amount: 0, currency: 'USD' },
          lineTotal: { amount: 0, currency: 'USD' },
        })),
        subtotal: { amount: 0, currency: 'USD' },
        total: { amount: 0, currency: 'USD' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.unshift(order);
      return order;
    },
    async cancelOrder(id) {
      await devDelay();
      const order = store.find(o => o.id === id);
      if (!order) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture order not found' });
      }
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      return order;
    },
  };
}
