import type {Id} from './common';
import type {UserRole} from './auth';

export type SupportQueryStatus = 'open' | 'in_progress' | 'resolved';

export type SupportQueryCategory =
  | 'orders'
  | 'quotations'
  | 'account'
  | 'payments'
  | 'other';

export interface SupportQuery {
  id: Id;
  userId: Id;
  userRole: UserRole;
  userLabel: string;
  businessName?: string;
  category: SupportQueryCategory;
  subject: string;
  message: string;
  status: SupportQueryStatus;
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
}

export interface CreateSupportQueryRequest {
  category: SupportQueryCategory;
  subject: string;
  message: string;
}

export interface UpdateSupportQueryStatusRequest {
  status: SupportQueryStatus;
  adminNote?: string;
}
