import type { Id } from './common';

export type NotificationType =
  | 'order_update'
  | 'rfq_update'
  | 'quotation_received'
  | 'group_buy_update'
  | 'system';

export interface AppNotification {
  id: Id;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  deepLink?: string;
}
