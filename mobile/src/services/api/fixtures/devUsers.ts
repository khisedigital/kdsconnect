/** DEV ONLY — not live API data. */

import type { AuthSession, AuthUser } from '../../../types';

export const DEV_ACCESS_TOKEN = 'dev-only-access-token';
export const DEV_REFRESH_TOKEN = 'dev-only-refresh-token';

export const devRetailerUser: AuthUser = {
  id: 'dev-user-retailer-1',
  email: 'retailer@dev.kdsconnect.local',
  role: 'retailer',
  displayName: 'Dev Retailer',
  businessName: 'Corner Market Dev',
};

export const devSupplierUser: AuthUser = {
  id: 'dev-user-supplier-1',
  email: 'supplier@dev.kdsconnect.local',
  role: 'supplier',
  displayName: 'Dev Supplier',
  businessName: 'Wholesale Foods Dev',
};

export const devSalesUser: AuthUser = {
  id: 'dev-user-sales-1',
  email: 'sales@dev.kdsconnect.local',
  role: 'sales',
  displayName: 'Dev Sales Rep',
  businessName: 'KDS Field Sales',
  phone: '+91 98765 43210',
  phoneVerified: false,
};

export const devAdminUser: AuthUser = {
  id: 'dev-user-admin-1',
  email: 'admin@dev.kdsconnect.local',
  role: 'admin',
  displayName: 'Dev Admin',
  businessName: 'Khise Digital Solution',
  phone: '+91 98765 00001',
  phoneVerified: true,
};

/** Tracks who is "logged in" for getCurrentUser in dev fixtures. */
let currentDevUser: AuthUser = devRetailerUser;

export function setCurrentDevUser(user: AuthUser): void {
  currentDevUser = user;
}

export function getCurrentDevUser(): AuthUser {
  return currentDevUser;
}

export function devSessionForUser(user: AuthUser): AuthSession {
  setCurrentDevUser(user);
  return {
    accessToken: DEV_ACCESS_TOKEN,
    refreshToken: DEV_REFRESH_TOKEN,
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    user,
  };
}

export function devUserForEmail(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  if (normalized.includes('admin')) {
    return devAdminUser;
  }
  if (normalized.includes('sales')) {
    return devSalesUser;
  }
  if (normalized.includes('supplier') || normalized.includes('wholesale')) {
    return devSupplierUser;
  }
  if (normalized.includes('retailer') || normalized.length > 0) {
    return devRetailerUser;
  }
  return null;
}
