import type { Id, Money } from './common';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuotationLine {
  id: Id;
  rfqItemId: Id;
  unitPrice: Money;
  quantity: number;
  leadTimeDays?: number;
  notes?: string;
}

export interface Quotation {
  id: Id;
  rfqId: Id;
  supplierId: Id;
  status: QuotationStatus;
  lines: QuotationLine[];
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationComparison {
  rfqId: Id;
  quotations: Quotation[];
  lowestTotal?: Money;
}
