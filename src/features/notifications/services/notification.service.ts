import { env } from "@/app/config/env";
import { notificationApi } from "@/axios/notification.api";
import { notificationMockService } from "./notification.mock";
import type { NotificationListFilters } from "../types";

export const notificationService = {
  list: (filters: NotificationListFilters) =>
    env.useMockApi ? notificationMockService.list(filters) : notificationApi.list(filters),

  markAsRead: (id: string) =>
    env.useMockApi ? notificationMockService.markAsRead(id) : notificationApi.markAsRead(id),

  markAllAsRead: () =>
    env.useMockApi ? notificationMockService.markAllAsRead() : notificationApi.markAllAsRead(),
};
