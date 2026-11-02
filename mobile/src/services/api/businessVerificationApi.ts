import type {
  BusinessVerificationProfile,
  SubmitBusinessVerificationRequest,
} from '../../types';
import {assertDevPreviewEnabled} from './devOnlyGuard';
import {BUSINESS_VERIFICATION_ENDPOINTS} from './endpoints';
import {devDelay} from './fixtures';
import type {HttpClient} from './httpClient';
import {ApiClientError} from './errors';

const UDYAM_PATTERN =
  /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/i;

export interface BusinessVerificationApi {
  getStatus(): Promise<BusinessVerificationProfile>;
  submit(
    payload: SubmitBusinessVerificationRequest,
  ): Promise<BusinessVerificationProfile>;
}

export function createBusinessVerificationApi(
  client: HttpClient,
): BusinessVerificationApi {
  return {
    getStatus: () =>
      client.request<BusinessVerificationProfile>({
        path: BUSINESS_VERIFICATION_ENDPOINTS.status,
        method: 'GET',
        operation: 'businessVerification.status',
      }),
    submit: payload =>
      client.request<BusinessVerificationProfile>({
        path: BUSINESS_VERIFICATION_ENDPOINTS.submit,
        method: 'POST',
        body: payload,
        operation: 'businessVerification.submit',
      }),
  };
}

export function createDevBusinessVerificationApi(options: {
  enableDevPreview: boolean;
}): BusinessVerificationApi {
  assertDevPreviewEnabled(options.enableDevPreview);

  let profile: BusinessVerificationProfile = {
    status: 'not_started',
    photos: [],
    lastUpdatedAt: new Date().toISOString(),
  };

  return {
    async getStatus() {
      await devDelay();
      return {
        ...profile,
        photos: profile.photos.map(photo => ({...photo})),
      };
    },
    async submit(payload) {
      await devDelay();
      const udyam = payload.udyamNumber.trim().toUpperCase();
      if (!UDYAM_PATTERN.test(udyam)) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message:
            'Enter a valid Udyam number (e.g. UDYAM-MH-12-1234567).',
        });
      }
      if (!payload.businessTradeName.trim()) {
        throw new ApiClientError({
          code: 'HTTP_ERROR',
          status: 400,
          message: 'Enter the trade / business name on your Udyam certificate.',
        });
      }
      const required: SubmitBusinessVerificationRequest['photos'][number]['kind'][] =
        ['udyam_certificate', 'storefront'];
      for (const kind of required) {
        if (!payload.photos.some(photo => photo.kind === kind && photo.localUri)) {
          throw new ApiClientError({
            code: 'HTTP_ERROR',
            status: 400,
            message: `Add a phone photo for ${kind.replace(/_/g, ' ')}.`,
          });
        }
      }

      profile = {
        status: 'under_review',
        udyamNumber: udyam,
        businessTradeName: payload.businessTradeName.trim(),
        photos: payload.photos.map(photo => ({
          kind: photo.kind,
          localUri: photo.localUri,
          fileName: photo.fileName,
          mimeType: photo.mimeType,
          capturedAt: new Date().toISOString(),
          uploadId: `dev-upload-${photo.kind}`,
        })),
        submittedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };

      // Dev fixture: auto-verify after submit so QA can see the verified state.
      profile = {
        ...profile,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };

      return {
        ...profile,
        photos: profile.photos.map(photo => ({...photo})),
      };
    },
  };
}

export {UDYAM_PATTERN};
