import type {
  AuthSession,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  PasswordResetRequest,
  RegisterRetailerRequest,
  RegisterSupplierRequest,
  StartMobileVerificationRequest,
  VerifyMobileOtpRequest,
} from '../../types';
import {formatIndianMobileDisplay, normalizeIndianMobile} from '../../utils/phone';
import {assertDevPreviewEnabled} from './devOnlyGuard';
import {AUTH_ENDPOINTS} from './endpoints';
import {
  DEV_ACCESS_TOKEN,
  devDelay,
  getCurrentDevUser,
  setCurrentDevUser,
  devSessionForUser,
  devUserForEmail,
} from './fixtures';
import type {HttpClient} from './httpClient';
import {ApiClientError} from './errors';

export interface AuthApi {
  login(request: LoginRequest): Promise<AuthSession>;
  registerRetailer(request: RegisterRetailerRequest): Promise<AuthSession>;
  registerSupplier(request: RegisterSupplierRequest): Promise<AuthSession>;
  requestPasswordReset(request: PasswordResetRequest): Promise<void>;
  changePassword(request: ChangePasswordRequest): Promise<void>;
  startMobileVerification(
    request: StartMobileVerificationRequest,
  ): Promise<{expiresInSeconds: number; otpHint: string}>;
  verifyMobileOtp(request: VerifyMobileOtpRequest): Promise<AuthUser>;
  getCurrentUser(): Promise<AuthUser>;
  logout(): Promise<void>;
}

export function createAuthApi(client: HttpClient): AuthApi {
  return {
    login: request =>
      client.request<AuthSession>({
        path: AUTH_ENDPOINTS.login,
        method: 'POST',
        body: request,
        operation: 'auth.login',
        skipAuth: true,
      }),
    registerRetailer: request =>
      client.request<AuthSession>({
        path: AUTH_ENDPOINTS.registerRetailer,
        method: 'POST',
        body: request,
        operation: 'auth.registerRetailer',
        skipAuth: true,
      }),
    registerSupplier: request =>
      client.request<AuthSession>({
        path: AUTH_ENDPOINTS.registerSupplier,
        method: 'POST',
        body: request,
        operation: 'auth.registerSupplier',
        skipAuth: true,
      }),
    requestPasswordReset: request =>
      client.request<void>({
        path: AUTH_ENDPOINTS.passwordReset,
        method: 'POST',
        body: request,
        operation: 'auth.passwordReset',
        skipAuth: true,
      }),
    changePassword: request =>
      client.request<void>({
        path: AUTH_ENDPOINTS.changePassword,
        method: 'POST',
        body: request,
        operation: 'auth.changePassword',
      }),
    startMobileVerification: request =>
      client.request<{expiresInSeconds: number; otpHint: string}>({
        path: AUTH_ENDPOINTS.startMobileVerification,
        method: 'POST',
        body: request,
        operation: 'auth.mobile.start',
      }),
    verifyMobileOtp: request =>
      client.request<AuthUser>({
        path: AUTH_ENDPOINTS.verifyMobileOtp,
        method: 'POST',
        body: request,
        operation: 'auth.mobile.verify',
      }),
    getCurrentUser: () =>
      client.request<AuthUser>({
        path: AUTH_ENDPOINTS.me,
        method: 'GET',
        operation: 'auth.me',
      }),
    logout: () =>
      client.request<void>({
        path: AUTH_ENDPOINTS.logout,
        method: 'POST',
        operation: 'auth.logout',
      }),
  };
}

export interface CreateDevAuthApiOptions {
  enableDevPreview: boolean;
}

/** DEV ONLY — isolated fixtures; must pass enableDevPreview: true. */
export function createDevAuthApi(options: CreateDevAuthApiOptions): AuthApi {
  assertDevPreviewEnabled(options.enableDevPreview);
  let pendingMobile: string | null = null;

  return {
    async login(request) {
      await devDelay();
      const user = devUserForEmail(request.email);
      if (!user || request.password.length < 4) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 401,
          message:
            'DEV fixture: invalid credentials (email containing retailer/supplier/sales/admin, password length >= 4)',
        });
      }
      return devSessionForUser(user);
    },
    async registerRetailer(request) {
      await devDelay();
      return devSessionForUser({
        id: `dev-retailer-${Date.now()}`,
        email: request.email,
        role: 'retailer',
        displayName: request.displayName,
        businessName: request.businessName,
        phone: request.phone,
        phoneVerified: false,
      });
    },
    async registerSupplier(request) {
      await devDelay();
      return devSessionForUser({
        id: `dev-supplier-${Date.now()}`,
        email: request.email,
        role: 'supplier',
        displayName: request.displayName,
        businessName: request.companyName,
        phone: request.phone,
        phoneVerified: false,
      });
    },
    async requestPasswordReset() {
      await devDelay();
    },
    async changePassword(request) {
      await devDelay();
      if (request.currentPassword.length < 4) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Current password is incorrect (dev: any password length >= 4).',
        });
      }
      if (request.newPassword.length < 8) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'New password must be at least 8 characters.',
        });
      }
    },
    async startMobileVerification(request) {
      await devDelay();
      const normalized = normalizeIndianMobile(request.phone);
      if (!normalized) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Enter a valid 10-digit Indian mobile number.',
        });
      }
      pendingMobile = normalized;
      return {
        expiresInSeconds: 300,
        otpHint: `OTP sent to ${formatIndianMobileDisplay(normalized)} (dev: use 123456)`,
      };
    },
    async verifyMobileOtp(request) {
      await devDelay();
      const normalized = normalizeIndianMobile(request.phone);
      if (!normalized || normalized !== pendingMobile) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Start mobile verification again with a valid number.',
        });
      }
      if (request.otp.trim() !== '123456') {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Invalid OTP. Use 123456 in development preview.',
        });
      }
      const current = getCurrentDevUser();
      const updated: AuthUser = {
        ...current,
        phone: formatIndianMobileDisplay(normalized),
        phoneVerified: true,
      };
      setCurrentDevUser(updated);
      pendingMobile = null;
      return updated;
    },
    async getCurrentUser() {
      await devDelay();
      return getCurrentDevUser();
    },
    async logout() {
      await devDelay();
    },
  };
}

export function isDevAccessToken(token: string | null): boolean {
  return token === DEV_ACCESS_TOKEN;
}
