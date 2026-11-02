import {SupportQuery} from '../models/index.js';
import {forbidden, notFound} from '../utils/errors.js';
import {paginatedResponse, parsePagination} from '../utils/pagination.js';

export async function listMyQueries(user, query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {userId: user.id};
  if (query.status && query.status !== 'all') {
    where.status = query.status;
  }

  const {rows, count} = await SupportQuery.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return paginatedResponse({
    items: rows.map(q => q.toDTO()),
    page,
    pageSize,
    totalItems: count,
  });
}

export async function listAllQueries(query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {};
  if (query.status && query.status !== 'all') {
    where.status = query.status;
  }

  const {rows, count} = await SupportQuery.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return paginatedResponse({
    items: rows.map(q => q.toDTO()),
    page,
    pageSize,
    totalItems: count,
  });
}

export async function createQuery(user, input) {
  if (user.role === 'admin') {
    throw forbidden('Admins review queries; they do not create them');
  }

  const query = await SupportQuery.create({
    userId: user.id,
    userRole: user.role,
    userLabel: user.displayName,
    businessName: user.businessName,
    category: input.category,
    subject: input.subject,
    message: input.message,
    status: 'open',
  });

  return query.toDTO();
}

export async function updateQueryStatus(id, input) {
  const query = await SupportQuery.findByPk(id);
  if (!query) {
    throw notFound('Support query not found');
  }
  query.status = input.status;
  if (input.adminNote !== undefined) {
    query.adminNote = input.adminNote;
  }
  await query.save();
  return query.toDTO();
}
