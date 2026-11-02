import {Op} from 'sequelize';

import {Product, ProductCategory} from '../models/index.js';
import {notFound} from '../utils/errors.js';
import {paginatedResponse, parsePagination} from '../utils/pagination.js';

export async function listProducts(query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {isActive: true};

  if (query.search) {
    where[Op.or] = [
      {name: {[Op.like]: `%${query.search}%`}},
      {sku: {[Op.like]: `%${query.search}%`}},
    ];
  }
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.supplierId) {
    where.supplierId = query.supplierId;
  }
  if (query.inStockOnly === true || query.inStockOnly === 'true') {
    where.inStock = true;
  }

  const {rows, count} = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [['name', 'ASC']],
  });

  return paginatedResponse({
    items: rows.map(p => p.toDTO()),
    page,
    pageSize,
    totalItems: count,
  });
}

export async function getProduct(id) {
  const product = await Product.findOne({where: {id, isActive: true}});
  if (!product) {
    throw notFound('Product not found');
  }
  return product.toDTO();
}

export async function listCategories() {
  const categories = await ProductCategory.findAll({order: [['name', 'ASC']]});
  return categories.map(c => c.toDTO());
}

export async function listSupplierProducts(supplierId, query) {
  return listProducts({...query, supplierId});
}
