import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  items: AppNotification[];
  unreadCount: number;
}

interface NotificationActions {
  setNotifications: (items: AppNotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>()((set) => ({
  items: [],
  unreadCount: 0,

  setNotifications: (items) =>
    set({ items, unreadCount: items.filter((n) => !n.read).length }),

  markAsRead: (id) =>
    set((state) => {
      const items = state.items.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { items, unreadCount: items.filter((n) => !n.read).length };
    }),

  markAllAsRead: () =>
    set((state) => ({
      items: state.items.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
