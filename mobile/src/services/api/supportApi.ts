import type {
  CreateSupportQueryRequest,
  PaginatedResponse,
  SupportQuery,
  SupportQueryStatus,
  UpdateSupportQueryStatusRequest,
} from '../../types';
import {assertDevPreviewEnabled} from './devOnlyGuard';
import {SUPPORT_ENDPOINTS} from './endpoints';
import {devDelay, devSupportQueries, getCurrentDevUser} from './fixtures';
import type {HttpClient} from './httpClient';

export interface SupportListParams {
  page?: number;
  pageSize?: number;
  status?: SupportQueryStatus | 'all';
}

export interface SupportApi {
  listMyQueries(
    params?: SupportListParams,
  ): Promise<PaginatedResponse<SupportQuery>>;
  listAllQueries(
    params?: SupportListParams,
  ): Promise<PaginatedResponse<SupportQuery>>;
  createQuery(request: CreateSupportQueryRequest): Promise<SupportQuery>;
  updateQueryStatus(
    id: string,
    request: UpdateSupportQueryStatusRequest,
  ): Promise<SupportQuery>;
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export function createSupportApi(client: HttpClient): SupportApi {
  return {
    listMyQueries: (params = {}) =>
      client.request<PaginatedResponse<SupportQuery>>({
        path: SUPPORT_ENDPOINTS.myQueries,
        method: 'GET',
        operation: 'support.queries.mine',
        query: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          status: params.status,
        },
      }),
    listAllQueries: (params = {}) =>
      client.request<PaginatedResponse<SupportQuery>>({
        path: SUPPORT_ENDPOINTS.allQueries,
        method: 'GET',
        operation: 'support.queries.all',
        query: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          status: params.status,
        },
      }),
    createQuery: request =>
      client.request<SupportQuery>({
        path: SUPPORT_ENDPOINTS.create,
        method: 'POST',
        operation: 'support.queries.create',
        body: request,
      }),
    updateQueryStatus: (id, request) =>
      client.request<SupportQuery>({
        path: SUPPORT_ENDPOINTS.updateStatus(id),
        method: 'PATCH',
        operation: 'support.queries.updateStatus',
        body: request,
      }),
  };
}

export function createDevSupportApi(options: {
  enableDevPreview: boolean;
}): SupportApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  return {
    async listMyQueries(params = {}) {
      await devDelay();
      const user = getCurrentDevUser();
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const items = [...devSupportQueries]
        .filter(q => q.userId === user.id)
        .filter(
          q =>
            !params.status ||
            params.status === 'all' ||
            q.status === params.status,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return paginate(items, page, pageSize);
    },

    async listAllQueries(params = {}) {
      await devDelay();
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const items = [...devSupportQueries]
        .filter(
          q =>
            !params.status ||
            params.status === 'all' ||
            q.status === params.status,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return paginate(items, page, pageSize);
    },

    async createQuery(request) {
      await devDelay();
      const user = getCurrentDevUser();
      const now = new Date().toISOString();
      const query: SupportQuery = {
        id: `support-dev-${Date.now()}`,
        userId: user.id,
        userRole: user.role,
        userLabel: user.displayName,
        businessName: user.businessName,
        category: request.category,
        subject: request.subject.trim(),
        message: request.message.trim(),
        status: 'open',
        createdAt: now,
        updatedAt: now,
      };
      devSupportQueries.unshift(query);
      return query;
    },

    async updateQueryStatus(id, request) {
      await devDelay();
      const index = devSupportQueries.findIndex(q => q.id === id);
      if (index < 0) {
        throw new Error(`Support query ${id} not found`);
      }
      const updated: SupportQuery = {
        ...devSupportQueries[index],
        status: request.status,
        adminNote: request.adminNote?.trim() || devSupportQueries[index].adminNote,
        updatedAt: new Date().toISOString(),
      };
      devSupportQueries[index] = updated;
      return updated;
    },
  };
}
