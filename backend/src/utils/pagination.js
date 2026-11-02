export function parsePagination(query, {defaultPageSize = 20, maxPageSize = 100} = {}) {
  const page = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1);
  const rawSize = Number.parseInt(String(query.pageSize ?? defaultPageSize), 10) || defaultPageSize;
  const pageSize = Math.min(maxPageSize, Math.max(1, rawSize));
  const offset = (page - 1) * pageSize;
  return {page, pageSize, offset, limit: pageSize};
}

export function paginatedResponse({items, page, pageSize, totalItems}) {
  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}
