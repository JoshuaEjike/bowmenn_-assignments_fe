import { mockDelay, nextId, paginate } from "@/app/lib/mock-api";
import type { AppNotification, NotificationListFilters } from "../types";

const mockNotifications: AppNotification[] = [
  {
    id: nextId("ntf"),
    type: "shipment_status_changed",
    title: "Shipment in transit",
    message: "Shipment BWM-10004 is now in transit to Kano.",
    isRead: false,
    relatedShipmentId: undefined,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: nextId("ntf"),
    type: "driver_assigned",
    title: "Driver assigned",
    message: "Tunde Bello has been assigned to shipment BWM-10002.",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: nextId("ntf"),
    type: "proof_of_delivery_uploaded",
    title: "Shipment delivered",
    message: "Shipment BWM-10001 has been delivered. Proof of delivery is available.",
    isRead: true,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: nextId("ntf"),
    type: "shipment_created",
    title: "Shipment booked",
    message: "Shipment BWM-10005 has been booked and is awaiting driver assignment.",
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export const notificationMockService = {
  async list(filters: NotificationListFilters) {
    await mockDelay(300);
    const sorted = [...mockNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
    return { ...paginate(sorted, filters), unreadCount };
  },

  async markAsRead(id: string): Promise<void> {
    await mockDelay(200);
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) notification.isRead = true;
  },

  async markAllAsRead(): Promise<void> {
    await mockDelay(300);
    mockNotifications.forEach((n) => {
      n.isRead = true;
    });
  },
};
