/** DEV ONLY — sample catalog fixtures, not live API responses. */

import type { Product, ProductCategory } from '../../../types';

export const devProductCategories: ProductCategory[] = [
  { id: 'cat-beverages', name: 'Beverages', slug: 'beverages' },
  { id: 'cat-dry-goods', name: 'Dry Goods', slug: 'dry-goods' },
];

export const devProducts: Product[] = [
  {
    id: 'prod-001',
    sku: 'BEV-330-COLA',
    name: 'Cola 330ml (24 pack)',
    description: 'DEV fixture product',
    categoryId: 'cat-beverages',
    unit: 'case',
    minOrderQuantity: 1,
    price: { amount: 18.5, currency: 'USD' },
    supplierId: 'dev-supplier-1',
    inStock: true,
  },
  {
    id: 'prod-002',
    sku: 'DRY-001-RICE',
    name: 'Jasmine Rice 20kg',
    categoryId: 'cat-dry-goods',
    unit: 'each',
    minOrderQuantity: 2,
    price: { amount: 42, currency: 'USD' },
    supplierId: 'dev-supplier-1',
    inStock: true,
  },
];
