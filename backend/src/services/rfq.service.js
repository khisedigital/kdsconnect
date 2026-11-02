import {Rfq, RfqItem} from '../models/index.js';
import {forbidden, notFound} from '../utils/errors.js';
import {paginatedResponse, parsePagination} from '../utils/pagination.js';

async function loadRfq(id) {
  return Rfq.findByPk(id, {include: [{model: RfqItem, as: 'items'}]});
}

export async function listRfqs(user, query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {};

  if (user.role === 'retailer') {
    where.retailerId = user.id;
  }
  if (query.status && query.status !== 'all') {
    where.status = query.status;
  }

  const {rows, count} = await Rfq.findAndCountAll({
    where,
    include: [{model: RfqItem, as: 'items'}],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  return paginatedResponse({
    items: rows.map(r => r.toDTO()),
    page,
    pageSize,
    totalItems: count,
  });
}

export async function getRfq(user, id) {
  const rfq = await loadRfq(id);
  if (!rfq) {
    throw notFound('RFQ not found');
  }
  if (user.role === 'retailer' && rfq.retailerId !== user.id) {
    throw forbidden();
  }
  return rfq.toDTO();
}

export async function createRfq(user, input) {
  const rfq = await Rfq.create({
    retailerId: user.id,
    title: input.title,
    status: 'draft',
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  });

  await RfqItem.bulkCreate(
    input.items.map(item => ({
      rfqId: rfq.id,
      productId: item.productId ?? null,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit ?? null,
      targetPrice: item.targetPrice ?? null,
      notes: item.notes ?? null,
    })),
  );

  return getRfq(user, rfq.id);
}

export async function submitRfq(user, id) {
  const rfq = await loadRfq(id);
  if (!rfq) {
    throw notFound('RFQ not found');
  }
  if (rfq.retailerId !== user.id) {
    throw forbidden();
  }
  if (rfq.status !== 'draft') {
    throw forbidden('Only draft RFQs can be submitted');
  }
  rfq.status = 'submitted';
  await rfq.save();
  return getRfq(user, id);
}
