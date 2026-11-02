/** Proposed business verification — Udyam + on-site phone photos. */

export type BusinessVerificationStatus =
  | 'not_started'
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected';

export type BusinessPhotoKind =
  | 'udyam_certificate'
  | 'storefront'
  | 'interior'
  | 'signboard';

export interface BusinessPhotoAsset {
  kind: BusinessPhotoKind;
  /** Local file URI from camera / gallery before upload. */
  localUri?: string;
  /** Server-side reference after upload (proposed contract). */
  uploadId?: string;
  fileName?: string;
  mimeType?: string;
  capturedAt?: string;
}

export interface BusinessVerificationProfile {
  status: BusinessVerificationStatus;
  udyamNumber?: string;
  businessTradeName?: string;
  photos: BusinessPhotoAsset[];
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  lastUpdatedAt: string;
}

export interface SubmitBusinessVerificationRequest {
  udyamNumber: string;
  businessTradeName: string;
  photos: Array<{
    kind: BusinessPhotoKind;
    /** Base64 or upload token — production uses multipart upload URLs. */
    localUri: string;
    fileName?: string;
    mimeType?: string;
  }>;
}
