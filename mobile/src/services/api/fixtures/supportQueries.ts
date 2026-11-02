/** DEV ONLY */

import type {SupportQuery} from '../../../types';

export const devSupportQueries: SupportQuery[] = [
  {
    id: 'support-dev-1',
    userId: 'dev-user-retailer-1',
    userRole: 'retailer',
    userLabel: 'Priya Sharma',
    businessName: 'Sharma Kirana',
    category: 'orders',
    subject: 'Order delayed after confirmation',
    message:
      'Order #order-dev-1 was confirmed two days ago but still shows packing. Can someone check with the wholesaler?',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: 'support-dev-2',
    userId: 'dev-user-supplier-1',
    userRole: 'supplier',
    userLabel: 'FreshBev Ops',
    businessName: 'FreshBev Wholesale',
    category: 'quotations',
    subject: 'Cannot submit quote on RFQ',
    message:
      'Trying to quote on Bulk sugar 1000 kg but submit fails. Need admin to check.',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3_600_000).toISOString(),
    adminNote: 'Looking into quotation form validation.',
  },
];
