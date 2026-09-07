import { request } from "./apiClient";
import type { AppNotification } from "../types";

export async function getNotifications(): Promise<{ notifications: AppNotification[] }> {
  return request("/notifications");
}

export async function markNotificationRead(id: string): Promise<{ notification: AppNotification }> {
  return request(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<{ message: string }> {
  return request("/notifications/read-all", { method: "POST" });
}
