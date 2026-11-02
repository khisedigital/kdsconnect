import type { BusinessProfile, DeliveryAddress } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { PROFILE_ENDPOINTS } from './endpoints';
import { devDelay, devRetailerUser } from './fixtures';
import type { HttpClient } from './httpClient';

export interface ProfileApi {
  getProfile(): Promise<BusinessProfile>;
  updateProfile(payload: Partial<BusinessProfile>): Promise<BusinessProfile>;
  addDeliveryAddress(address: Omit<DeliveryAddress, 'id'>): Promise<DeliveryAddress>;
}

const devProfile: BusinessProfile = {
  userId: devRetailerUser.id,
  role: 'retailer',
  businessName: devRetailerUser.businessName ?? 'Dev Business',
  contactEmail: devRetailerUser.email,
  contactPhone: '+1-555-0100',
  deliveryAddresses: [
    {
      id: 'addr-dev-1',
      label: 'Main store',
      line1: '100 Market St',
      city: 'Dev City',
      postalCode: '00000',
      country: 'US',
      isDefault: true,
    },
  ],
};

export function createProfileApi(client: HttpClient): ProfileApi {
  return {
    getProfile: () =>
      client.request<BusinessProfile>({
        path: PROFILE_ENDPOINTS.me,
        method: 'GET',
        operation: 'profile.get',
      }),
    updateProfile: payload =>
      client.request<BusinessProfile>({
        path: PROFILE_ENDPOINTS.me,
        method: 'PATCH',
        body: payload,
        operation: 'profile.update',
      }),
    addDeliveryAddress: address =>
      client.request<DeliveryAddress>({
        path: PROFILE_ENDPOINTS.deliveryAddresses,
        method: 'POST',
        body: address,
        operation: 'profile.addDeliveryAddress',
      }),
  };
}

export function createDevProfileApi(options: { enableDevPreview: boolean }): ProfileApi {
  assertDevPreviewEnabled(options.enableDevPreview);
  let profile = { ...devProfile, deliveryAddresses: [...devProfile.deliveryAddresses] };

  return {
    async getProfile() {
      await devDelay();
      return profile;
    },
    async updateProfile(payload) {
      await devDelay();
      profile = {
        ...profile,
        ...payload,
        deliveryAddresses: payload.deliveryAddresses ?? profile.deliveryAddresses,
      };
      return profile;
    },
    async addDeliveryAddress(address) {
      await devDelay();
      const created: DeliveryAddress = {
        ...address,
        id: `addr-dev-${Date.now()}`,
      };
      profile.deliveryAddresses.push(created);
      return created;
    },
  };
}
