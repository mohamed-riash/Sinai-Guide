import { storageService, KEYS } from './storageService';

export const notificationService = {
  getNotifications: () => {
    return storageService.getItem(KEYS.NOTIFICATIONS, []);
  },

  addNotification: ({ title, message }) => {
    const notifications = storageService.getItem(KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: `n-${Date.now()}`,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.unshift(newNotif);
    storageService.setItem(KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  },

  markAllAsRead: () => {
    const notifications = storageService.getItem(KEYS.NOTIFICATIONS, []);
    const updated = notifications.map(n => ({ ...n, read: true }));
    storageService.setItem(KEYS.NOTIFICATIONS, updated);
    return updated;
  }
};
