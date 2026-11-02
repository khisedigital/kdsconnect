import type { AppNotification, PaginatedResponse } from '../../types';
import { assertDevPreviewEnabled } from './devOnlyGuard';
import { NOTIFICATION_ENDPOINTS } from './endpoints';
import { devDelay } from './fixtures';
import type { HttpClient } from './httpClient';

export interface NotificationsApi {
  listNotifications(page?: number, pageSize?: number): Promise<PaginatedResponse<AppNotification>>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
}

const devNotifications: AppNotification[] = [
  {
    id: 'notif-dev-1',
    type: 'order_update',
    title: 'Order confirmed (DEV)',
    body: 'Fixture notification — not from live API.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export function createNotificationsApi(client: HttpClient): NotificationsApi {
  return {
    listNotifications: (page = 1, pageSize = 20) =>
      client.request<PaginatedResponse<AppNotification>>({
        path: NOTIFICATION_ENDPOINTS.list,
        method: 'GET',
        query: { page, pageSize },
        operation: 'notifications.list',
      }),
    markRead: id =>
      client.request<void>({
        path: NOTIFICATION_ENDPOINTS.markRead(id),
        method: 'POST',
        operation: 'notifications.markRead',
      }),
    markAllRead: () =>
      client.request<void>({
        path: NOTIFICATION_ENDPOINTS.markAllRead,
        method: 'POST',
        operation: 'notifications.markAllRead',
      }),
  };
}

export function createDevNotificationsApi(options: { enableDevPreview: boolean }): NotificationsApi {
  assertDevPreviewEnabled(options.enableDevPreview);
  const store = [...devNotifications];

  return {
    async listNotifications(page = 1, pageSize = 20) {
      await devDelay();
      return {
        items: store,
        page,
        pageSize,
        totalItems: store.length,
        totalPages: 1,
      };
    },
    async markRead(id) {
      await devDelay();
      const item = store.find(n => n.id === id);
      if (item) {
        item.read = true;
      }
    },
    async markAllRead() {
      await devDelay();
      store.forEach(n => {
        n.read = true;
      });
    },
  };
}
