import type { Id } from './common';

export type RfqStatus =
  | 'draft'
  | 'submitted'
  | 'quoted'
  | 'awarded'
  | 'cancelled'
  | 'expired';

export interface RfqItem {
  id: Id;
  productId?: Id;
  description: string;
  quantity: number;
  unit?: string;
  targetPrice?: number;
  notes?: string;
}

export interface Rfq {
  id: Id;
  retailerId: Id;
  title: string;
  status: RfqStatus;
  items: RfqItem[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
