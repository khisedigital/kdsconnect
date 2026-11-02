import {Op} from 'sequelize';

import {User} from '../models/index.js';
import {conflict} from '../utils/errors.js';
import {hashPassword} from '../utils/password.js';
import {paginatedResponse, parsePagination} from '../utils/pagination.js';

function toAccount(user) {
  return {
    id: user.id,
    kind: user.role === 'supplier' ? 'supplier' : 'retailer',
    displayName: user.displayName,
    businessName: user.businessName,
    email: user.email,
    phone: user.phone,
    status: user.kycStatus === 'pending' ? 'pending_kyc' : 'active',
    onboardedAt: user.createdAt.toISOString(),
    onboardedBySalesId: user.onboardedBySalesId,
  };
}

export async function getSalesDashboard(salesId) {
  const where = {onboardedBySalesId: salesId};
  const [retailersOnboarded, wholesalersOnboarded, pendingKyc, onboardedThisWeek] =
    await Promise.all([
      User.count({where: {...where, role: 'retailer'}}),
      User.count({where: {...where, role: 'supplier'}}),
      User.count({where: {...where, kycStatus: 'pending'}}),
      User.count({
        where: {
          ...where,
          createdAt: {[Op.gte]: new Date(Date.now() - 7 * 86_400_000)},
        },
      }),
    ]);

  return {
    retailersOnboarded,
    wholesalersOnboarded,
    totalOnboarded: retailersOnboarded + wholesalersOnboarded,
    onboardedThisWeek,
    pendingKyc,
  };
}

export async function listAccounts(salesId, query) {
  const {page, pageSize, offset, limit} = parsePagination(query);
  const where = {onboardedBySalesId: salesId};
  if (query.kind === 'retailer') {
    where.role = 'retailer';
  } else if (query.kind === 'wholesaler') {
    where.role = 'supplier';
  }

  const {rows, count} = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return paginatedResponse({
    items: rows.map(toAccount),
    page,
    pageSize,
    totalItems: count,
  });
}

export async function onboardRetailer(salesId, input) {
  const existing = await User.findOne({where: {email: input.email.toLowerCase()}});
  if (existing) {
    throw conflict('An account with this email already exists');
  }

  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash: await hashPassword(input.password),
    role: 'retailer',
    displayName: input.displayName,
    businessName: input.businessName,
    phone: input.phone,
    phoneVerified: false,
    onboardedBySalesId: salesId,
    kycStatus: 'pending',
  });

  return toAccount(user);
}

export async function onboardWholesaler(salesId, input) {
  const existing = await User.findOne({where: {email: input.email.toLowerCase()}});
  if (existing) {
    throw conflict('An account with this email already exists');
  }

  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash: await hashPassword(input.password),
    role: 'supplier',
    displayName: input.displayName,
    businessName: input.companyName,
    phone: input.phone,
    taxId: input.taxId ?? null,
    phoneVerified: false,
    onboardedBySalesId: salesId,
    businessVerificationStatus: 'pending',
  });

  return toAccount(user);
}
