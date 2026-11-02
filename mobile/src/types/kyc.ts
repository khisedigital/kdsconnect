/** Proposed KYC contract — Aadhaar e-KYC via backend / UIDAI partner. */

export type KycStatus =
  | 'not_started'
  | 'otp_sent'
  | 'pending_review'
  | 'verified'
  | 'rejected'
  | 'expired';

export interface KycProfile {
  status: KycStatus;
  /** Masked Aadhaar, e.g. XXXX-XXXX-1234 — never store full number on device long-term. */
  aadhaarMasked?: string;
  verifiedName?: string;
  verifiedAt?: string;
  lastUpdatedAt: string;
  provider?: 'aadhaar';
}

export interface StartAadhaarKycRequest {
  /** 12-digit Aadhaar number — sent only to the backend KYC contract. */
  aadhaarNumber: string;
}

export interface VerifyAadhaarOtpRequest {
  /** Opaque session id returned by startAadhaarKyc. */
  sessionId: string;
  otp: string;
}

export interface StartAadhaarKycResponse {
  sessionId: string;
  /** Masked destination hint, e.g. mobile ending ••87 */
  otpHint?: string;
  expiresInSeconds: number;
}
