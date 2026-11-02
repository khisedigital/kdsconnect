import {Op} from 'sequelize';

import {
  Order,
  OrderItem,
  Rfq,
  RfqItem,
  SupportQuery,
  User,
} from '../models/index.js';
import {paginatedResponse, parsePagination} from '../utils/pagination.js';

const ACTIVE_ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped'];
const REQUESTED_RFQ_STATUSES = ['submitted', 'quoted', 'draft'];

function moneyLabel(amount, currency = 'INR') {
  return `${currency} ${Number(amount).toFixed(2)}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export async function getDashboard() {
  const [
    totalRetailers,
    totalWholesalers,
    totalSalesReps,
    pendingKyc,
    pendingBusinessVerification,
    activeOrders,
    requestedQuotations,
    waitingQuotations,
    pendingOrders,
    openSupportQueries,
    onboardedThisMonth,
  ] = await Promise.all([
    User.count({where: {role: 'retailer', isActive: true}}),
    User.count({where: {role: 'supplier', isActive: true}}),
    User.count({where: {role: 'sales', isActive: true}}),
    User.count({where: {kycStatus: 'pending'}}),
    User.count({where: {businessVerificationStatus: 'pending'}}),
    Order.count({where: {status: {[Op.in]: ACTIVE_ORDER_STATUSES}}}),
    Rfq.count({where: {status: {[Op.in]: REQUESTED_RFQ_STATUSES}}}),
    Rfq.count({where: {status: 'submitted'}}),
    Order.count({where: {status: {[Op.in]: ['pending', 'confirmed']}}}),
    SupportQuery.count({
      where: {status: {[Op.in]: ['open', 'in_progress']}},
    }),
    User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const pendingItems = [
    {
      id: 'kyc',
      title: 'Aadhaar KYC pending',
      detail: 'Retailers waiting to unlock full buying',
      count: pendingKyc,
      tone: 'warning',
      icon: 'idCard',
      target: 'none',
    },
    {
      id: 'biz',
      title: 'Business verification pending',
      detail: 'Udyam / shop photo checks still open',
      count: pendingBusinessVerification,
      tone: 'warning',
      icon: 'camera',
      target: 'none',
    },
    {
      id: 'orders-pending',
      title: 'Orders needing action',
      detail: 'Payment pending or confirmed — pack soon',
      count: pendingOrders,
      tone: 'info',
      icon: 'orders',
      target: 'orders',
    },
    {
      id: 'rfq-wait',
      title: 'Quotations waiting for quotes',
      detail: 'Retailer RFQs with no wholesaler response yet',
      count: waitingQuotations,
      tone: 'info',
      icon: 'quote',
      target: 'quotations',
    },
    {
      id: 'support',
      title: 'Support queries open',
      detail: 'Retailer and wholesaler messages waiting for admin',
      count: openSupportQueries,
      tone: 'info',
      icon: 'support',
      target: 'support',
    },
  ].filter(item => item.count > 0);

  return {
    totalRetailers,
    totalWholesalers,
    totalSalesReps,
    onboardedThisMonth,
    pendingKyc,
    pendingBusinessVerification,
    activeOrders,
    requestedQuotations,
    pendingOrders,
    waitingQuotations,
    pendingItems,
    activeOrderItems: [],
    requestedQuotationItems: [],
  };
}

export async function listActiveOrders(query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {status: {[Op.in]: ACTIVE_ORDER_STATUSES}};
  if (query.status && query.status !== 'all') {
    where.status = query.status;
  }

  const {rows, count} = await Order.findAndCountAll({
    where,
    include: [
      {model: OrderItem, as: 'items'},
      {model: User, as: 'retailer', attributes: ['id', 'businessName', 'displayName']},
      {model: User, as: 'supplier', attributes: ['id', 'businessName', 'displayName']},
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  let items = rows.map(order => {
    const first = order.items?.[0];
    const summaryLine = first
      ? order.items.length === 1
        ? `${first.quantity} × ${first.productName}`
        : `${first.quantity} × ${first.productName} + ${order.items.length - 1} more`
      : 'No line items';

    return {
      id: order.id,
      retailerLabel:
        order.retailer?.businessName ?? order.retailer?.displayName ?? 'Retailer',
      supplierLabel:
        order.supplier?.businessName ?? order.supplier?.displayName ?? 'Wholesaler',
      status: order.status,
      statusLabel: order.status,
      summaryLine,
      totalLabel: moneyLabel(order.totalAmount, order.currency),
      createdAt: formatDate(order.createdAt),
      itemCount: order.items?.length ?? 0,
    };
  });

  if (query.query) {
    const q = String(query.query).toLowerCase();
    items = items.filter(item =>
      `${item.retailerLabel} ${item.supplierLabel} ${item.summaryLine} ${item.id}`
        .toLowerCase()
        .includes(q),
    );
  }

  return paginatedResponse({
    items,
    page,
    pageSize,
    totalItems: query.query ? items.length : count,
  });
}

export async function listRequestedQuotations(query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {status: {[Op.in]: REQUESTED_RFQ_STATUSES}};
  if (query.status && query.status !== 'all') {
    where.status = query.status;
  }

  const {rows, count} = await Rfq.findAndCountAll({
    where,
    include: [
      {model: RfqItem, as: 'items'},
      {model: User, as: 'retailer', attributes: ['id', 'businessName', 'displayName']},
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  let items = rows.map(rfq => {
    const first = rfq.items?.[0];
    const summaryLine = first
      ? `${first.quantity}${first.unit ? ` ${first.unit}` : ''} · ${first.description}`
      : 'No line items';

    return {
      id: rfq.id,
      title: rfq.title,
      retailerLabel:
        rfq.retailer?.businessName ?? rfq.retailer?.displayName ?? 'Retailer',
      status: rfq.status,
      statusLabel: rfq.status,
      summaryLine,
      itemCount: rfq.items?.length ?? 0,
      createdAt: formatDate(rfq.createdAt),
      dueDate: rfq.dueDate ? formatDate(rfq.dueDate) : undefined,
      needsAttention: rfq.status === 'submitted',
    };
  });

  if (query.query) {
    const q = String(query.query).toLowerCase();
    items = items.filter(item =>
      `${item.title} ${item.retailerLabel} ${item.summaryLine} ${item.id}`
        .toLowerCase()
        .includes(q),
    );
  }

  return paginatedResponse({
    items,
    page,
    pageSize,
    totalItems: query.query ? items.length : count,
  });
}
