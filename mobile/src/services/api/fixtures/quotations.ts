/** DEV ONLY */

import type { Quotation } from '../../../types';

export const devQuotations: Quotation[] = [
  {
    id: 'quote-dev-1',
    rfqId: 'rfq-dev-1',
    supplierId: 'dev-supplier-1',
    status: 'sent',
    lines: [
      {
        id: 'quote-line-1',
        rfqItemId: 'rfq-item-1',
        unitPrice: { amount: 17.25, currency: 'USD' },
        quantity: 10,
        leadTimeDays: 3,
      },
    ],
    validUntil: new Date(Date.now() + 14 * 86_400_000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
