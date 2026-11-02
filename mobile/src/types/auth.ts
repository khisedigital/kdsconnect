/** Proposed backend contract — subject to confirmation with API team. */

export type UserRole = 'retailer' | 'supplier' | 'sales' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  businessName?: string;
  /** E.164-ish display or +91 formatted mobile. */
  phone?: string;
  phoneVerified?: boolean;
  /** Sales / admin who created this account (proposed contract). */
  onboardedBySalesId?: string;
}

/** Proposed contract — authenticated password change. */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** Proposed contract — mobile OTP verification. */
export interface StartMobileVerificationRequest {
  phone: string;
}

export interface VerifyMobileOtpRequest {
  phone: string;
  otp: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
  user: AuthUser;
}

/** Proposed contract */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Proposed contract */
export interface RegisterRetailerRequest {
  email: string;
  password: string;
  displayName: string;
  businessName: string;
  phone?: string;
}

/** Proposed contract */
export interface RegisterSupplierRequest {
  email: string;
  password: string;
  displayName: string;
  companyName: string;
  taxId?: string;
  phone?: string;
}

/** Proposed contract */
export interface PasswordResetRequest {
  email: string;
}
