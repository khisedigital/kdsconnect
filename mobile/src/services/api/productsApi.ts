import type { PaginatedResponse, Product, ProductCategory, ProductFilters } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { PRODUCT_ENDPOINTS } from './endpoints';
import { devDelay, devProductCategories, devProducts } from './fixtures';
import type { HttpClient } from './httpClient';
import { ApiClientError } from './errors';

export interface ProductsApi {
  listProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  getProduct(id: string): Promise<Product>;
  listCategories(): Promise<ProductCategory[]>;
}

export function createProductsApi(client: HttpClient): ProductsApi {
  return {
    listProducts: filters =>
      client.request<PaginatedResponse<Product>>({
        path: PRODUCT_ENDPOINTS.list,
        method: 'GET',
        query: {
          search: filters?.search,
          categoryId: filters?.categoryId,
          supplierId: filters?.supplierId,
          inStockOnly: filters?.inStockOnly,
          page: filters?.page ?? 1,
          pageSize: filters?.pageSize ?? 20,
        },
        operation: 'products.list',
      }),
    getProduct: id =>
      client.request<Product>({
        path: PRODUCT_ENDPOINTS.detail(id),
        method: 'GET',
        operation: 'products.detail',
      }),
    listCategories: () =>
      client.request<ProductCategory[]>({
        path: PRODUCT_ENDPOINTS.categories,
        method: 'GET',
        operation: 'products.categories',
      }),
  };
}

export function createDevProductsApi(options: { enableDevPreview: boolean }): ProductsApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  return {
    async listProducts(filters) {
      await devDelay();
      let items = [...devProducts];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      if (filters?.categoryId) {
        items = items.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters?.inStockOnly) {
        items = items.filter(p => p.inStock);
      }
      const page = filters?.page ?? 1;
      const pageSize = filters?.pageSize ?? 20;
      return {
        items,
        page,
        pageSize,
        totalItems: items.length,
        totalPages: 1,
      };
    },
    async getProduct(id) {
      await devDelay();
      const product = devProducts.find(p => p.id === id);
      if (!product) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 404,
          message: `DEV fixture: product ${id} not found`,
        });
      }
      return product;
    },
    async listCategories() {
      await devDelay();
      return devProductCategories;
    },
  };
}
