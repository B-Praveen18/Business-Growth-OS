import { apiFetch } from "./api-client";

export async function getNotifications() {
  return apiFetch<{ notifications: any[] }>(`/notifications`);
}

export async function markNotificationRead(id: string) {
  return apiFetch(`/notifications/read`, { method: "PUT", body: JSON.stringify({ _id: id }) });
}

export async function markAllNotificationsRead() {
  return apiFetch(`/notifications/read-all`, { method: "PUT" });
}
