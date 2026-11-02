/** DEV ONLY */

import type { Rfq } from '../../../types';

export const devRfqs: Rfq[] = [
  {
    id: 'rfq-dev-1',
    retailerId: 'dev-user-retailer-1',
    title: 'Monthly beverage restock',
    status: 'submitted',
    items: [
      {
        id: 'rfq-item-1',
        productId: 'prod-001',
        description: 'Cola 330ml cases',
        quantity: 10,
        unit: 'case',
      },
    ],
    dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
