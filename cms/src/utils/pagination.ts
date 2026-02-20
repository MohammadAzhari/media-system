export type PaginationParams = {
  page?: number;
  limit?: number;
};

export function getPagination(query: PaginationParams) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
