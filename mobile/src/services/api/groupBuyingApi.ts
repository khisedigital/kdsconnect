import type { GroupBuyCampaign, GroupBuyParticipation, PaginatedResponse } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { GROUP_BUYING_ENDPOINTS } from './endpoints';
import { devDelay, devGroupBuyCampaigns } from './fixtures';
import type { HttpClient } from './httpClient';
import { ApiClientError } from './errors';

export interface JoinGroupBuyPayload {
  quantity: number;
}

export interface GroupBuyingApi {
  listCampaigns(page?: number, pageSize?: number): Promise<PaginatedResponse<GroupBuyCampaign>>;
  getCampaign(id: string): Promise<GroupBuyCampaign>;
  joinCampaign(id: string, payload: JoinGroupBuyPayload): Promise<GroupBuyParticipation>;
  listParticipations(): Promise<GroupBuyParticipation[]>;
}

export function createGroupBuyingApi(client: HttpClient): GroupBuyingApi {
  return {
    listCampaigns: (page = 1, pageSize = 20) =>
      client.request<PaginatedResponse<GroupBuyCampaign>>({
        path: GROUP_BUYING_ENDPOINTS.campaigns,
        method: 'GET',
        query: { page, pageSize },
        operation: 'groupBuy.listCampaigns',
      }),
    getCampaign: id =>
      client.request<GroupBuyCampaign>({
        path: GROUP_BUYING_ENDPOINTS.campaignDetail(id),
        method: 'GET',
        operation: 'groupBuy.campaignDetail',
      }),
    joinCampaign: (id, payload) =>
      client.request<GroupBuyParticipation>({
        path: GROUP_BUYING_ENDPOINTS.join(id),
        method: 'POST',
        body: payload,
        operation: 'groupBuy.join',
      }),
    listParticipations: () =>
      client.request<GroupBuyParticipation[]>({
        path: GROUP_BUYING_ENDPOINTS.participations,
        method: 'GET',
        operation: 'groupBuy.participations',
      }),
  };
}

export function createDevGroupBuyingApi(options: { enableDevPreview: boolean }): GroupBuyingApi {
  assertDevPreviewEnabled(options.enableDevPreview);
  const campaigns = [...devGroupBuyCampaigns];

  return {
    async listCampaigns(page = 1, pageSize = 20) {
      await devDelay();
      return {
        items: campaigns,
        page,
        pageSize,
        totalItems: campaigns.length,
        totalPages: 1,
      };
    },
    async getCampaign(id) {
      await devDelay();
      const campaign = campaigns.find(c => c.id === id);
      if (!campaign) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture campaign not found' });
      }
      return campaign;
    },
    async joinCampaign(id, payload) {
      await devDelay();
      const campaign = campaigns.find(c => c.id === id);
      if (!campaign) {
        throw new ApiClientError({ code: 'HTTP_ERROR', status: 404, message: 'DEV fixture campaign not found' });
      }
      campaign.currentQuantity += payload.quantity;
      return {
        id: `gb-part-${Date.now()}`,
        campaignId: id,
        retailerId: 'dev-user-retailer-1',
        quantity: payload.quantity,
        joinedAt: new Date().toISOString(),
      };
    },
    async listParticipations() {
      await devDelay();
      return [];
    },
  };
}
