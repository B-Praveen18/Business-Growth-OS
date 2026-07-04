import { getNotificationsCollection } from "../db";
import type { Notification } from "../types";

export async function emitNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification["type"] = "system",
): Promise<void> {
  try {
    const col = await getNotificationsCollection();
    const notification: Notification = {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(notification);
  } catch (error) {
    // Notification emission should never break the main operation
    console.error("Failed to emit notification:", error);
  }
}
