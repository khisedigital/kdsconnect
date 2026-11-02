/** DEV ONLY */

import type { GroupBuyCampaign } from '../../../types';

export const devGroupBuyCampaigns: GroupBuyCampaign[] = [
  {
    id: 'gb-dev-1',
    title: 'Group buy — Jasmine Rice',
    productId: 'prod-002',
    supplierId: 'dev-supplier-1',
    targetQuantity: 100,
    currentQuantity: 42,
    unitPrice: { amount: 39.5, currency: 'USD' },
    status: 'open',
    endsAt: new Date(Date.now() + 10 * 86_400_000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];
