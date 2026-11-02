import type { Id, Money } from './common';

export type ProductUnit = 'each' | 'case' | 'kg' | 'lb' | 'liter';

export interface ProductCategory {
  id: Id;
  name: string;
  slug: string;
  parentId?: Id;
}

export interface Product {
  id: Id;
  sku: string;
  name: string;
  description?: string;
  categoryId: Id;
  unit: ProductUnit;
  minOrderQuantity: number;
  price: Money;
  supplierId: Id;
  imageUrl?: string;
  inStock: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: Id;
  supplierId?: Id;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
}
