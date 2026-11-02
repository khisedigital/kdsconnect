import type { PaginatedResponse, Rfq } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { RFQ_ENDPOINTS } from './endpoints';
import { devDelay, devRfqs } from './fixtures';
import type { HttpClient } from './httpClient';
import { ApiClientError } from './errors';

export interface CreateRfqPayload {
  title: string;
  items: Array<{
    description: string;
    quantity: number;
    productId?: string;
    unit?: string;
    targetPrice?: number;
    notes?: string;
  }>;
  dueDate?: string;
}

export interface RfqsApi {
  listRfqs(page?: number, pageSize?: number): Promise<PaginatedResponse<Rfq>>;
  getRfq(id: string): Promise<Rfq>;
  createRfq(payload: CreateRfqPayload): Promise<Rfq>;
  submitRfq(id: string): Promise<Rfq>;
}

export function createRfqsApi(client: HttpClient): RfqsApi {
  return {
    listRfqs: (page = 1, pageSize = 20) =>
      client.request<PaginatedResponse<Rfq>>({
        path: RFQ_ENDPOINTS.list,
        method: 'GET',
        query: { page, pageSize },
        operation: 'rfqs.list',
      }),
    getRfq: id =>
      client.request<Rfq>({
        path: RFQ_ENDPOINTS.detail(id),
        method: 'GET',
        operation: 'rfqs.detail',
      }),
    createRfq: payload =>
      client.request<Rfq>({
        path: RFQ_ENDPOINTS.create,
        method: 'POST',
        body: payload,
        operation: 'rfqs.create',
      }),
    submitRfq: id =>
      client.request<Rfq>({
        path: RFQ_ENDPOINTS.submit(id),
        method: 'POST',
        operation: 'rfqs.submit',
      }),
  };
}

export function createDevRfqsApi(options: { enableDevPreview: boolean }): RfqsApi {
  assertDevPreviewEnabled(options.enableDevPreview);
  const store = [...devRfqs];

  return {
    async listRfqs(page = 1, pageSize = 20) {
      await devDelay();
      return {
        items: store,
        page,
        pageSize,
        totalItems: store.length,
        totalPages: 1,
      };
    },
    async getRfq(id) {
      await devDelay();
      const rfq = store.find(r => r.id === id);
      if (!rfq) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture RFQ not found' });
      }
      return rfq;
    },
    async createRfq(payload) {
      await devDelay();
      const rfq: Rfq = {
        id: `rfq-dev-${Date.now()}`,
        retailerId: 'dev-user-retailer-1',
        title: payload.title,
        status: 'draft',
        items: payload.items.map((item, index) => ({
          id: `rfq-item-${index}`,
          ...item,
        })),
        dueDate: payload.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.unshift(rfq);
      return rfq;
    },
    async submitRfq(id) {
      await devDelay();
      const rfq = store.find(r => r.id === id);
      if (!rfq) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture RFQ not found' });
      }
      rfq.status = 'submitted';
      rfq.updatedAt = new Date().toISOString();
      return rfq;
    },
  };
}
