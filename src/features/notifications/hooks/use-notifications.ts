import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import type { NotificationListFilters } from "../types";

const notificationKeys = {
  all: () => ["notifications"] as const,
  list: (filters: NotificationListFilters) => [...notificationKeys.all(), "list", filters] as const,
};

export function useNotifications(filters: NotificationListFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationService.list(filters),
    // Notifications are the one place a short poll is worth the extra
    // requests — there's no push channel yet, and staying silent for a
    // full 30s default staleTime would make the bell feel broken.
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all() }),
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all() }),
  });
}
