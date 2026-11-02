/** DEV ONLY */

import type { Order } from '../../../types';

export const devOrders: Order[] = [
  {
    id: 'order-dev-1',
    retailerId: 'dev-user-retailer-1',
    supplierId: 'dev-supplier-1',
    status: 'confirmed',
    items: [
      {
        id: 'order-item-1',
        productId: 'prod-001',
        productName: 'Cola 330ml (24 pack)',
        quantity: 5,
        unitPrice: { amount: 18.5, currency: 'USD' },
        lineTotal: { amount: 92.5, currency: 'USD' },
      },
    ],
    subtotal: { amount: 92.5, currency: 'USD' },
    total: { amount: 92.5, currency: 'USD' },
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
