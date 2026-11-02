import type { Quotation, QuotationComparison } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { QUOTATION_ENDPOINTS } from './endpoints';
import { devDelay, devQuotations } from './fixtures';
import type { HttpClient } from './httpClient';
import { ApiClientError } from './errors';

export interface QuotationsApi {
  listForRfq(rfqId: string): Promise<Quotation[]>;
  getQuotation(id: string): Promise<Quotation>;
  compareForRfq(rfqId: string): Promise<QuotationComparison>;
}

export function createQuotationsApi(client: HttpClient): QuotationsApi {
  return {
    listForRfq: rfqId =>
      client.request<Quotation[]>({
        path: QUOTATION_ENDPOINTS.listForRfq(rfqId),
        method: 'GET',
        operation: 'quotations.listForRfq',
      }),
    getQuotation: id =>
      client.request<Quotation>({
        path: QUOTATION_ENDPOINTS.detail(id),
        method: 'GET',
        operation: 'quotations.detail',
      }),
    compareForRfq: rfqId =>
      client.request<QuotationComparison>({
        path: QUOTATION_ENDPOINTS.compare(rfqId),
        method: 'GET',
        operation: 'quotations.compare',
      }),
  };
}

export function createDevQuotationsApi(options: { enableDevPreview: boolean }): QuotationsApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  return {
    async listForRfq(rfqId) {
      await devDelay();
      return devQuotations.filter(q => q.rfqId === rfqId);
    },
    async getQuotation(id) {
      await devDelay();
      const quotation = devQuotations.find(q => q.id === id);
      if (!quotation) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture quotation not found' });
      }
      return quotation;
    },
    async compareForRfq(rfqId) {
      await devDelay();
      const quotations = devQuotations.filter(q => q.rfqId === rfqId);
      const lowest = quotations[0]?.lines[0]?.unitPrice;
      return {
        rfqId,
        quotations,
        lowestTotal: lowest,
      };
    },
  };
}
