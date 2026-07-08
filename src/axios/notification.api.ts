import { httpClient } from "./axios";
import type { AppNotification, NotificationListFilters } from "@/features/notifications/types";

interface NotificationListResponse {
  items: AppNotification[];
  unreadCount: number;
}

// NOTE: like the rest of the axios/*.api.ts files, this assumes a response
// interceptor unwraps the `{ success, message, data, meta }` envelope down to
// `data` before it reaches here (see the note in axios/interceptors.ts). Wire
// that unwrapping — or adjust these `.then` mappings — before flipping
// VITE_USE_MOCK_API to false against the real backend.
export const notificationApi = {
  list: (filters: NotificationListFilters) =>
    httpClient
      .get<NotificationListResponse>("/notifications", { params: { page: filters.page, limit: filters.pageSize } })
      .then((r) => r.data),

  markAsRead: (id: string) => httpClient.patch<void>(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () => httpClient.patch<void>("/notifications/read-all").then((r) => r.data),
};
