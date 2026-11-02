/**
 * PROPOSED REST paths — required backend contracts, NOT confirmed with the API team.
 * Update this file when OpenAPI / backend specs are published.
 */

export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  registerRetailer: '/auth/register/retailer',
  registerSupplier: '/auth/register/supplier',
  passwordReset: '/auth/password-reset',
  changePassword: '/auth/change-password',
  startMobileVerification: '/auth/mobile/start',
  verifyMobileOtp: '/auth/mobile/verify-otp',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  me: '/auth/me',
} as const;

export const PRODUCT_ENDPOINTS = {
  list: '/products',
  detail: (id: string) => `/products/${id}`,
  categories: '/products/categories',
} as const;

export const RFQ_ENDPOINTS = {
  list: '/rfqs',
  detail: (id: string) => `/rfqs/${id}`,
  create: '/rfqs',
  submit: (id: string) => `/rfqs/${id}/submit`,
} as const;

export const QUOTATION_ENDPOINTS = {
  listForRfq: (rfqId: string) => `/rfqs/${rfqId}/quotations`,
  detail: (id: string) => `/quotations/${id}`,
  compare: (rfqId: string) => `/rfqs/${rfqId}/quotations/compare`,
} as const;

export const GROUP_BUYING_ENDPOINTS = {
  campaigns: '/group-buy/campaigns',
  campaignDetail: (id: string) => `/group-buy/campaigns/${id}`,
  join: (id: string) => `/group-buy/campaigns/${id}/join`,
  participations: '/group-buy/participations',
} as const;

export const ORDER_ENDPOINTS = {
  list: '/orders',
  detail: (id: string) => `/orders/${id}`,
  create: '/orders',
  cancel: (id: string) => `/orders/${id}/cancel`,
} as const;

export const NOTIFICATION_ENDPOINTS = {
  list: '/notifications',
  markRead: (id: string) => `/notifications/${id}/read`,
  markAllRead: '/notifications/read-all',
} as const;

export const PROFILE_ENDPOINTS = {
  me: '/profile',
  deliveryAddresses: '/profile/delivery-addresses',
} as const;

export const KYC_ENDPOINTS = {
  status: '/kyc/status',
  startAadhaar: '/kyc/aadhaar/start',
  verifyAadhaarOtp: '/kyc/aadhaar/verify-otp',
} as const;

export const BUSINESS_VERIFICATION_ENDPOINTS = {
  status: '/business-verification/status',
  submit: '/business-verification/submit',
} as const;

export const SUPPLIER_ENDPOINTS = {
  dashboard: '/supplier/dashboard',
  products: '/supplier/products',
  orders: '/supplier/orders',
} as const;

export const SALES_ENDPOINTS = {
  dashboard: '/sales/dashboard',
  accounts: '/sales/accounts',
  onboardRetailer: '/sales/onboard/retailer',
  onboardWholesaler: '/sales/onboard/wholesaler',
} as const;

export const ADMIN_ENDPOINTS = {
  dashboard: '/admin/dashboard',
  activeOrders: '/admin/orders/active',
  requestedQuotations: '/admin/rfqs/requested',
} as const;

export const SUPPORT_ENDPOINTS = {
  myQueries: '/support/queries/mine',
  allQueries: '/support/queries',
  create: '/support/queries',
  updateStatus: (id: string) => `/support/queries/${id}/status`,
} as const;
