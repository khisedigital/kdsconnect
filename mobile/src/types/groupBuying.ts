import type { Id, Money } from './common';

export type GroupBuyCampaignStatus =
  | 'draft'
  | 'open'
  | 'threshold_met'
  | 'closed'
  | 'fulfilled'
  | 'cancelled';

export interface GroupBuyCampaign {
  id: Id;
  title: string;
  description?: string;
  productId: Id;
  supplierId: Id;
  targetQuantity: number;
  currentQuantity: number;
  unitPrice: Money;
  status: GroupBuyCampaignStatus;
  endsAt: string;
  createdAt: string;
}

export interface GroupBuyParticipation {
  id: Id;
  campaignId: Id;
  retailerId: Id;
  quantity: number;
  joinedAt: string;
}
