import type { UserRole } from './auth';
import type { Id } from './common';

export type OnboardedAccountKind = Extract<UserRole, 'retailer' | 'supplier'>;

export interface OnboardedAccount {
  id: Id;
  kind: OnboardedAccountKind;
  displayName: string;
  businessName: string;
  email: string;
  phone?: string;
  city?: string;
  onboardedAt: string;
  onboardedBySalesId: Id;
  status: 'active' | 'invited' | 'pending_kyc';
}

export interface SalesDashboardSummary {
  retailersOnboarded: number;
  wholesalersOnboarded: number;
  totalOnboarded: number;
  onboardedThisWeek: number;
  pendingKyc: number;
}

export interface OnboardRetailerBySalesRequest {
  displayName: string;
  businessName: string;
  email: string;
  phone?: string;
  city?: string;
  password: string;
}

export interface OnboardWholesalerBySalesRequest {
  displayName: string;
  companyName: string;
  email: string;
  phone?: string;
  city?: string;
  taxId?: string;
  password: string;
}
