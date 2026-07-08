import * as Popover from "@radix-ui/react-popover";
import { Bell, CheckCheck, PackageCheck, PackagePlus, Truck, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/loaders/skeleton";
import { EmptyState } from "@/components/empty/empty-state";
import { cn } from "@/app/lib/cn";
import { formatRelativeTime } from "@/app/utils/format";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/features/notifications/hooks/use-notifications";
import type { AppNotification, NotificationType } from "@/features/notifications/types";

const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  shipment_created: PackagePlus,
  driver_assigned: UserCheck,
  shipment_status_changed: Truck,
  proof_of_delivery_uploaded: PackageCheck,
};

function NotificationRow({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
}) {
  const Icon = TYPE_ICONS[notification.type];

  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onRead(notification.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted",
        !notification.isRead && "bg-primary-50/60",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          notification.isRead ? "bg-muted text-muted-foreground" : "bg-primary-100 text-primary-700",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm",
              notification.isRead ? "text-foreground" : "font-semibold text-foreground",
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
      </div>
    </button>
  );
}

export function NotificationPanel() {
  const { data, isLoading } = useNotifications({ page: 1, pageSize: 10 });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-accent-500" />
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-md border border-border bg-surface shadow-raised sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => markAllAsRead.mutate()}
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : !data || data.items.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="You're all caught up"
                description="No notifications yet."
                className="py-10"
              />
            ) : (
              <div className="space-y-1">
                {data.items.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onRead={(id) => markAsRead.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
