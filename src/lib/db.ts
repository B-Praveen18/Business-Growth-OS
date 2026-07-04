import { MongoClient, ObjectId, type Collection, type Db } from "mongodb";
import type { User } from "./auth";
import type {
  Metric,
  Risk,
  RoadmapItem,
  ActivityRecord,
  Decision,
  Report,
  Competitor,
  Notification,
  ChatSession,
} from "./types";

export interface CompanySuggestion {
  _id?: string;
  userEmail: string;
  title: string;
  description: string;
  category: "growth" | "efficiency" | "risk" | "revenue" | "operations";
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
  impact?: string;
  priority?: "high" | "medium" | "low";
}

let client: MongoClient | undefined;
let db: Db | undefined;

async function getClient(): Promise<MongoClient> {
  if (!client) {
    const uri = process.env.VITE_MONGO_URI ?? "mongodb://localhost:27017";
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export async function getDb(): Promise<Db> {
  if (!db) {
    const mongoClient = await getClient();
    db = mongoClient.db(process.env.VITE_MONGO_DB ?? "businessos");
    // ensure unique index on email and index on suggestions.userEmail
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("suggestions").createIndex({ userEmail: 1 });
    // New collection indexes
    await db.collection("metrics").createIndex({ companyId: 1 });
    await db.collection("metrics").createIndex({ companyId: 1, createdAt: -1 });
    await db.collection("risks").createIndex({ companyId: 1 });
    await db.collection("roadmap").createIndex({ companyId: 1 });
    await db.collection("activity").createIndex({ companyId: 1, createdAt: -1 });
    await db.collection("decisions").createIndex({ companyId: 1 });
    await db.collection("reports").createIndex({ companyId: 1, createdAt: -1 });
    await db.collection("competitors").createIndex({ companyId: 1 });
    await db.collection("notifications").createIndex({ userId: 1, createdAt: -1 });
    await db.collection("notifications").createIndex({ userId: 1, read: 1 });
    await db.collection("chat_sessions").createIndex({ companyId: 1, userId: 1 });
  }
  return db;
}

export async function getUsersCollection(): Promise<Collection<User>> {
  return (await getDb()).collection<User>("users");
}

export async function getSuggestionsCollection(): Promise<Collection<CompanySuggestion>> {
  return (await getDb()).collection<CompanySuggestion>("suggestions");
}

export async function getMetricsCollection(): Promise<Collection<Metric>> {
  return (await getDb()).collection<Metric>("metrics");
}

export async function getRisksCollection(): Promise<Collection<Risk>> {
  return (await getDb()).collection<Risk>("risks");
}

export async function getRoadmapCollection(): Promise<Collection<RoadmapItem>> {
  return (await getDb()).collection<RoadmapItem>("roadmap");
}

export async function getActivityCollection(): Promise<Collection<ActivityRecord>> {
  return (await getDb()).collection<ActivityRecord>("activity");
}

export async function getDecisionsCollection(): Promise<Collection<Decision>> {
  return (await getDb()).collection<Decision>("decisions");
}

export async function getReportsCollection(): Promise<Collection<Report>> {
  return (await getDb()).collection<Report>("reports");
}

export async function getCompetitorsCollection(): Promise<Collection<Competitor>> {
  return (await getDb()).collection<Competitor>("competitors");
}

export async function getNotificationsCollection(): Promise<Collection<Notification>> {
  return (await getDb()).collection<Notification>("notifications");
}

export async function getChatSessionsCollection(): Promise<Collection<ChatSession>> {
  return (await getDb()).collection<ChatSession>("chat_sessions");
}

export { ObjectId };
