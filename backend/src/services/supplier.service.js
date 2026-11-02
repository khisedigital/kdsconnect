import {Op} from 'sequelize';

import {Order, Product, Rfq} from '../models/index.js';

export async function getSupplierDashboard(supplierId) {
  const [pendingRfqs, openOrders, activeProducts] = await Promise.all([
    Rfq.count({where: {status: {[Op.in]: ['submitted', 'quoted']}}}),
    Order.count({
      where: {
        supplierId,
        status: {[Op.in]: ['pending', 'confirmed', 'processing', 'shipped']},
      },
    }),
    Product.count({where: {supplierId, isActive: true}}),
  ]);

  return {pendingRfqs, openOrders, activeProducts};
}
