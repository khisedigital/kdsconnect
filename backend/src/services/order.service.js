import {Order, OrderItem, Product} from '../models/index.js';
import {badRequest, forbidden, notFound} from '../utils/errors.js';
import {paginatedResponse, parsePagination} from '../utils/pagination.js';
import {sequelize} from '../models/index.js';

async function loadOrder(id) {
  return Order.findByPk(id, {include: [{model: OrderItem, as: 'items'}]});
}

export async function listOrders(user, query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {};

  if (user.role === 'retailer') {
    where.retailerId = user.id;
  } else if (user.role === 'supplier') {
    where.supplierId = user.id;
  }
  if (query.status && query.status !== 'all') {
    where.status = query.status;
  }

  const {rows, count} = await Order.findAndCountAll({
    where,
    include: [{model: OrderItem, as: 'items'}],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  return paginatedResponse({
    items: rows.map(o => o.toDTO()),
    page,
    pageSize,
    totalItems: count,
  });
}

export async function getOrder(user, id) {
  const order = await loadOrder(id);
  if (!order) {
    throw notFound('Order not found');
  }
  if (
    user.role === 'retailer' &&
    order.retailerId !== user.id
  ) {
    throw forbidden();
  }
  if (user.role === 'supplier' && order.supplierId !== user.id) {
    throw forbidden();
  }
  return order.toDTO();
}

export async function createOrder(user, input) {
  return sequelize.transaction(async transaction => {
    const products = await Product.findAll({
      where: {
        id: input.items.map(i => i.productId),
        supplierId: input.supplierId,
        isActive: true,
      },
      transaction,
    });

    if (products.length !== input.items.length) {
      throw badRequest('One or more products are invalid for this supplier');
    }

    const productMap = new Map(products.map(p => [p.id, p]));
    let subtotal = 0;
    const lineItems = input.items.map(item => {
      const product = productMap.get(item.productId);
      const unit = Number(product.priceAmount);
      const line = unit * item.quantity;
      subtotal += line;
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        currency: product.priceCurrency,
        unitPriceAmount: unit,
        lineTotalAmount: line,
      };
    });

    const order = await Order.create(
      {
        retailerId: user.id,
        supplierId: input.supplierId,
        status: 'pending',
        currency: lineItems[0]?.currency ?? 'INR',
        subtotalAmount: subtotal,
        totalAmount: subtotal,
      },
      {transaction},
    );

    await OrderItem.bulkCreate(
      lineItems.map(item => ({...item, orderId: order.id})),
      {transaction},
    );

    const full = await Order.findByPk(order.id, {
      include: [{model: OrderItem, as: 'items'}],
      transaction,
    });
    return full.toDTO();
  });
}

export async function cancelOrder(user, id) {
  const order = await loadOrder(id);
  if (!order) {
    throw notFound('Order not found');
  }
  if (order.retailerId !== user.id) {
    throw forbidden();
  }
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw badRequest('This order can no longer be cancelled');
  }
  order.status = 'cancelled';
  await order.save();
  return order.toDTO();
}
