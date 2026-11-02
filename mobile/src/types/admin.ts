export interface AdminOrderPreview {
  id: string;
  retailerLabel: string;
  supplierLabel: string;
  status: string;
  statusLabel: string;
  summaryLine: string;
  totalLabel: string;
  createdAt: string;
  itemCount: number;
}

export interface AdminRfqPreview {
  id: string;
  title: string;
  retailerLabel: string;
  status: string;
  statusLabel: string;
  summaryLine: string;
  itemCount: number;
  createdAt: string;
  dueDate?: string;
  needsAttention: boolean;
}

export type AdminPendingTarget = 'orders' | 'quotations' | 'support' | 'none';

export interface AdminPendingItem {
  id: string;
  title: string;
  detail: string;
  count: number;
  tone: 'warning' | 'info';
  icon: 'idCard' | 'camera' | 'quote' | 'orders' | 'alert' | 'clock' | 'support';
  target: AdminPendingTarget;
}

export interface AdminDashboardSummary {
  totalRetailers: number;
  totalWholesalers: number;
  totalSalesReps: number;
  onboardedThisMonth: number;
  pendingKyc: number;
  pendingBusinessVerification: number;
  activeOrders: number;
  requestedQuotations: number;
  pendingOrders: number;
  waitingQuotations: number;
  pendingItems: AdminPendingItem[];
  activeOrderItems: AdminOrderPreview[];
  requestedQuotationItems: AdminRfqPreview[];
}
