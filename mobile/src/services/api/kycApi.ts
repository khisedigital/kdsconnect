import type {
  KycProfile,
  StartAadhaarKycRequest,
  StartAadhaarKycResponse,
  VerifyAadhaarOtpRequest,
} from '../../types';
import {assertDevPreviewEnabled} from './devOnlyGuard';
import {KYC_ENDPOINTS} from './endpoints';
import {devDelay} from './fixtures';
import type {HttpClient} from './httpClient';
import {ApiClientError} from './errors';

export interface KycApi {
  getStatus(): Promise<KycProfile>;
  startAadhaarKyc(
    payload: StartAadhaarKycRequest,
  ): Promise<StartAadhaarKycResponse>;
  verifyAadhaarOtp(payload: VerifyAadhaarOtpRequest): Promise<KycProfile>;
}

function maskAadhaar(aadhaarNumber: string): string {
  const digits = aadhaarNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function createKycApi(client: HttpClient): KycApi {
  return {
    getStatus: () =>
      client.request<KycProfile>({
        path: KYC_ENDPOINTS.status,
        method: 'GET',
        operation: 'kyc.status',
      }),
    startAadhaarKyc: payload =>
      client.request<StartAadhaarKycResponse>({
        path: KYC_ENDPOINTS.startAadhaar,
        method: 'POST',
        body: payload,
        operation: 'kyc.aadhaar.start',
      }),
    verifyAadhaarOtp: payload =>
      client.request<KycProfile>({
        path: KYC_ENDPOINTS.verifyAadhaarOtp,
        method: 'POST',
        body: payload,
        operation: 'kyc.aadhaar.verifyOtp',
      }),
  };
}

export function createDevKycApi(options: {enableDevPreview: boolean}): KycApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  let profile: KycProfile = {
    status: 'not_started',
    lastUpdatedAt: new Date().toISOString(),
    provider: 'aadhaar',
  };
  let pendingSessionId: string | null = null;
  let pendingAadhaar: string | null = null;

  return {
    async getStatus() {
      await devDelay();
      return {...profile};
    },
    async startAadhaarKyc(payload) {
      await devDelay();
      const digits = payload.aadhaarNumber.replace(/\D/g, '');
      if (digits.length !== 12) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Aadhaar number must be 12 digits',
        });
      }
      pendingSessionId = `aadhaar-session-${Date.now()}`;
      pendingAadhaar = digits;
      profile = {
        ...profile,
        status: 'otp_sent',
        aadhaarMasked: maskAadhaar(digits),
        lastUpdatedAt: new Date().toISOString(),
        provider: 'aadhaar',
      };
      return {
        sessionId: pendingSessionId,
        otpHint: 'OTP sent to Aadhaar-linked mobile (dev fixture)',
        expiresInSeconds: 300,
      };
    },
    async verifyAadhaarOtp(payload) {
      await devDelay();
      if (!pendingSessionId || payload.sessionId !== pendingSessionId) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'KYC session expired. Start Aadhaar verification again.',
        });
      }
      if (payload.otp.trim() !== '123456') {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Invalid OTP. Use 123456 in development preview.',
        });
      }
      profile = {
        status: 'verified',
        aadhaarMasked: pendingAadhaar
          ? maskAadhaar(pendingAadhaar)
          : profile.aadhaarMasked,
        verifiedName: 'Verified user (dev fixture)',
        verifiedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        provider: 'aadhaar',
      };
      pendingSessionId = null;
      pendingAadhaar = null;
      return {...profile};
    },
  };
}
