import { httpClient } from "./axios";
import type { AppNotification, NotificationListFilters } from "@/features/notifications/types";

interface NotificationListResponse {
  items: AppNotification[];
  unreadCount: number;
}

export const notificationApi = {
  list: (filters: NotificationListFilters) =>
    httpClient
      .get<NotificationListResponse>("/notifications", {
        params: { page: filters.page, limit: filters.pageSize },
      })
      .then((r) => r.data),

  markAsRead: (id: string) => httpClient.patch<void>(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () => httpClient.patch<void>("/notifications/read-all").then((r) => r.data),
};
