import { getActivityCollection } from "../db";
import type { ActivityRecord } from "../types";

export async function logActivity(
  companyId: string,
  userId: string,
  module: string,
  action: string,
  description: string,
): Promise<void> {
  try {
    const col = await getActivityCollection();
    const record: ActivityRecord = {
      companyId,
      userId,
      module,
      action,
      description,
      createdAt: new Date().toISOString(),
    };
    await col.insertOne(record);
  } catch (error) {
    // Activity logging should never break the main operation
    console.error("Failed to log activity:", error);
  }
}
