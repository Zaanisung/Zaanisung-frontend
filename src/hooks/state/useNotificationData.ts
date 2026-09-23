import { useState, useEffect, useCallback } from "react";
import type { AppNotification, FullUser } from "../../types";
import * as api from "../../services";

/**
 * In-app notifications slice: fetched once the user is signed in, with
 * mark-read state management that keeps the local list in sync.
 */
export function useNotificationData(customerUser: FullUser | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const { notifications: items } = await api.getNotifications();
      setNotifications(Array.isArray(items) ? items : []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (customerUser) fetchNotifications();
  }, [customerUser, fetchNotifications]);

  const handleMarkNotificationRead = useCallback(async (id: string) => {
    try {
      const { notification } = await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, readAt: notification.readAt } : n))
      );
    } catch {
      /* silent */
    }
  }, []);

  const handleMarkAllNotificationsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
    } catch {
      /* silent */
    }
  }, []);

  return {
    notifications,
    setNotifications,
    fetchNotifications,
    onMarkNotificationRead: handleMarkNotificationRead,
    onMarkAllNotificationsRead: handleMarkAllNotificationsRead,
  };
}