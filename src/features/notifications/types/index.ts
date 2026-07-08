export const NOTIFICATION_TYPES = [
  "shipment_created",
  "driver_assigned",
  "shipment_status_changed",
  "proof_of_delivery_uploaded",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedShipmentId?: string;
  createdAt: string;
}

export interface NotificationListFilters {
  page: number;
  pageSize: number;
}
