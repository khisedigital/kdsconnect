import type {
  AdminDashboardSummary,
  AdminOrderPreview,
  AdminRfqPreview,
  PaginatedResponse,
} from '../../types';
import {formatDate, formatMoney} from '../../utils/format';
import {assertDevPreviewEnabled} from './devOnlyGuard';
import {ADMIN_ENDPOINTS} from './endpoints';
import {devDelay, devOrders, devRfqs, devSupportQueries} from './fixtures';
import type {HttpClient} from './httpClient';

export interface AdminListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  query?: string;
}

export interface AdminApi {
  getDashboard(): Promise<AdminDashboardSummary>;
  listActiveOrders(
    params?: AdminListParams,
  ): Promise<PaginatedResponse<AdminOrderPreview>>;
  listRequestedQuotations(
    params?: AdminListParams,
  ): Promise<PaginatedResponse<AdminRfqPreview>>;
}

export function createAdminApi(client: HttpClient): AdminApi {
  return {
    getDashboard: () =>
      client.request<AdminDashboardSummary>({
        path: ADMIN_ENDPOINTS.dashboard,
        method: 'GET',
        operation: 'admin.dashboard',
      }),
    listActiveOrders: (params = {}) =>
      client.request<PaginatedResponse<AdminOrderPreview>>({
        path: ADMIN_ENDPOINTS.activeOrders,
        method: 'GET',
        operation: 'admin.orders.active',
        query: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          status: params.status,
          query: params.query,
        },
      }),
    listRequestedQuotations: (params = {}) =>
      client.request<PaginatedResponse<AdminRfqPreview>>({
        path: ADMIN_ENDPOINTS.requestedQuotations,
        method: 'GET',
        operation: 'admin.rfqs.requested',
        query: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          status: params.status,
          query: params.query,
        },
      }),
  };
}

const ACTIVE_ORDER_STATUSES = new Set([
  'pending',
  'confirmed',
  'processing',
  'shipped',
]);

const REQUESTED_RFQ_STATUSES = new Set(['submitted', 'quoted', 'draft']);

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Payment pending',
  confirmed: 'Confirmed — pack soon',
  processing: 'Being packed',
  shipped: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const RFQ_STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Waiting for quotes',
  quoted: 'Quotes received',
  awarded: 'Awarded',
  closed: 'Closed',
};

const RETAILER_NAMES: Record<string, string> = {
  'dev-user-retailer-1': 'Sharma Kirana',
  'dev-user-retailer-2': 'City Mart',
};

const SUPPLIER_NAMES: Record<string, string> = {
  'dev-supplier-1': 'FreshBev Wholesale',
  'dev-supplier-2': 'Agro Trade Co.',
};

function orderSummary(items: {productName: string; quantity: number}[]) {
  if (items.length === 0) {
    return 'No line items';
  }
  const first = items[0];
  if (items.length === 1) {
    return `${first.quantity} × ${first.productName}`;
  }
  return `${first.quantity} × ${first.productName} + ${items.length - 1} more`;
}

function rfqSummary(
  items: {description?: string; quantity: number; unit?: string}[],
) {
  if (items.length === 0) {
    return 'No line items';
  }
  const first = items[0];
  const unit = first.unit ? ` ${first.unit}` : '';
  const label = first.description ?? 'Item';
  if (items.length === 1) {
    return `${first.quantity}${unit} · ${label}`;
  }
  return `${first.quantity}${unit} · ${label} + ${items.length - 1} more`;
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  return {
    items: slice,
    page,
    pageSize,
    totalItems: items.length,
    totalPages,
  };
}

function buildDevCatalog() {
  const extraOrders = [
    {
      ...devOrders[0],
      id: 'order-dev-2',
      status: 'processing' as const,
      retailerId: 'dev-user-retailer-2',
      supplierId: 'dev-supplier-2',
      createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'order-item-2',
          productId: 'prod-002',
          productName: 'Basmati Rice 25kg',
          quantity: 40,
          unitPrice: {amount: 22, currency: 'USD'},
          lineTotal: {amount: 880, currency: 'USD'},
        },
        {
          id: 'order-item-3',
          productId: 'prod-003',
          productName: 'Sunflower Oil 15L',
          quantity: 12,
          unitPrice: {amount: 31, currency: 'USD'},
          lineTotal: {amount: 372, currency: 'USD'},
        },
      ],
      subtotal: {amount: 1252, currency: 'USD'},
      total: {amount: 1252, currency: 'USD'},
    },
    {
      ...devOrders[0],
      id: 'order-dev-3',
      status: 'shipped' as const,
      createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      ...devOrders[0],
      id: 'order-dev-4',
      status: 'confirmed' as const,
      retailerId: 'dev-user-retailer-2',
      createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      ...devOrders[0],
      id: 'order-dev-5',
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 12 * 3_600_000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const extraRfqs = [
    {
      ...devRfqs[0],
      id: 'rfq-dev-2',
      title: 'Bulk sugar 1000 kg',
      status: 'submitted' as const,
      retailerId: 'dev-user-retailer-2',
      createdAt: new Date(Date.now() - 86_400_000).toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'rfq-item-2',
          description: 'Refined sugar',
          quantity: 1000,
          unit: 'kg',
        },
      ],
    },
    {
      ...devRfqs[0],
      id: 'rfq-dev-3',
      title: 'Cooking oil weekly',
      status: 'quoted' as const,
      createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      ...devRfqs[0],
      id: 'rfq-dev-4',
      title: 'Wheat flour 500 bags',
      status: 'submitted' as const,
      retailerId: 'dev-user-retailer-1',
      createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'rfq-item-4',
          description: 'Atta 50kg bags',
          quantity: 500,
          unit: 'bag',
        },
      ],
    },
  ];

  const orders = [...devOrders, ...extraOrders]
    .filter(order => ACTIVE_ORDER_STATUSES.has(order.status))
    .map(
      (order): AdminOrderPreview => ({
        id: order.id,
        retailerLabel:
          RETAILER_NAMES[order.retailerId] ??
          `Retailer ${order.retailerId.slice(-4)}`,
        supplierLabel: order.supplierId
          ? (SUPPLIER_NAMES[order.supplierId] ??
            `Wholesaler ${order.supplierId.slice(-4)}`)
          : 'Unassigned wholesaler',
        status: order.status,
        statusLabel: ORDER_STATUS_LABEL[order.status] ?? order.status,
        summaryLine: orderSummary(order.items),
        totalLabel: formatMoney(order.total),
        createdAt: formatDate(order.createdAt),
        itemCount: order.items.length,
      }),
    );

  const rfqs = [...devRfqs, ...extraRfqs]
    .filter(rfq => REQUESTED_RFQ_STATUSES.has(rfq.status))
    .map(
      (rfq): AdminRfqPreview => ({
        id: rfq.id,
        title: rfq.title,
        retailerLabel:
          RETAILER_NAMES[rfq.retailerId] ??
          `Retailer ${rfq.retailerId.slice(-4)}`,
        status: rfq.status,
        statusLabel: RFQ_STATUS_LABEL[rfq.status] ?? rfq.status,
        summaryLine: rfqSummary(rfq.items),
        itemCount: rfq.items.length,
        createdAt: formatDate(rfq.createdAt),
        dueDate: rfq.dueDate ? formatDate(rfq.dueDate) : undefined,
        needsAttention: rfq.status === 'submitted',
      }),
    );

  return {orders, rfqs};
}

function matchesQuery(haystack: string, query?: string) {
  if (!query?.trim()) {
    return true;
  }
  return haystack.toLowerCase().includes(query.trim().toLowerCase());
}

export function createDevAdminApi(options: {
  enableDevPreview: boolean;
}): AdminApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  return {
    async getDashboard() {
      await devDelay();
      const {orders, rfqs} = buildDevCatalog();
      const waitingQuotations = rfqs.filter(
        rfq => rfq.status === 'submitted',
      ).length;
      const pendingOrders = orders.filter(
        order =>
          order.status === 'pending' || order.status === 'confirmed',
      ).length;
      const pendingKyc = 12;
      const pendingBusinessVerification = 9;
      const openSupportQueries = devSupportQueries.filter(
        q => q.status === 'open' || q.status === 'in_progress',
      ).length;

      return {
        totalRetailers: 128,
        totalWholesalers: 46,
        totalSalesReps: 8,
        onboardedThisMonth: 17,
        pendingKyc,
        pendingBusinessVerification,
        activeOrders: orders.length,
        requestedQuotations: rfqs.length,
        pendingOrders,
        waitingQuotations,
        pendingItems: [
          {
            id: 'kyc',
            title: 'Aadhaar KYC pending',
            detail: 'Retailers waiting to unlock full buying',
            count: pendingKyc,
            tone: 'warning' as const,
            icon: 'idCard' as const,
            target: 'none' as const,
          },
          {
            id: 'biz',
            title: 'Business verification pending',
            detail: 'Udyam / shop photo checks still open',
            count: pendingBusinessVerification,
            tone: 'warning' as const,
            icon: 'camera' as const,
            target: 'none' as const,
          },
          {
            id: 'orders-pending',
            title: 'Orders needing action',
            detail: 'Payment pending or confirmed — pack soon',
            count: pendingOrders,
            tone: 'info' as const,
            icon: 'orders' as const,
            target: 'orders' as const,
          },
          {
            id: 'rfq-wait',
            title: 'Quotations waiting for quotes',
            detail: 'Retailer RFQs with no wholesaler response yet',
            count: waitingQuotations,
            tone: 'info' as const,
            icon: 'quote' as const,
            target: 'quotations' as const,
          },
          {
            id: 'support',
            title: 'Support queries open',
            detail: 'Retailer and wholesaler messages waiting for admin',
            count: openSupportQueries,
            tone: 'info' as const,
            icon: 'support' as const,
            target: 'support' as const,
          },
        ].filter(item => item.count > 0),
        activeOrderItems: orders.slice(0, 3),
        requestedQuotationItems: rfqs.slice(0, 3),
      };
    },

    async listActiveOrders(params = {}) {
      await devDelay();
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const {orders} = buildDevCatalog();
      const filtered = orders.filter(order => {
        const statusOk =
          !params.status ||
          params.status === 'all' ||
          order.status === params.status;
        const queryOk = matchesQuery(
          `${order.retailerLabel} ${order.supplierLabel} ${order.summaryLine} ${order.id}`,
          params.query,
        );
        return statusOk && queryOk;
      });
      return paginate(filtered, page, pageSize);
    },

    async listRequestedQuotations(params = {}) {
      await devDelay();
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const {rfqs} = buildDevCatalog();
      const filtered = rfqs.filter(rfq => {
        const statusOk =
          !params.status ||
          params.status === 'all' ||
          rfq.status === params.status;
        const queryOk = matchesQuery(
          `${rfq.title} ${rfq.retailerLabel} ${rfq.summaryLine} ${rfq.id}`,
          params.query,
        );
        return statusOk && queryOk;
      });
      return paginate(filtered, page, pageSize);
    },
  };
}
