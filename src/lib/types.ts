// Shared TypeScript interfaces for all MongoDB collections.

export interface Metric {
  _id?: string;
  companyId: string;
  revenue: number;
  profit: number;
  customers: number;
  growthRate: number;
  burnRate: number;
  runway: number;
  employeeCount: number;
  churnRate: number;
  month?: string;
  forecast?: number;
  target?: number;
  leads?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  _id?: string;
  companyId: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  probability: number;
  category: string;
  owner: string;
  mitigation: string;
  status: "open" | "mitigated" | "closed";
  dueDate?: string;
  createdAt: string;
}

export interface RoadmapItem {
  _id?: string;
  companyId: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "done" | "active" | "upcoming";
  assignee: string;
  progress: number;
  quarter?: string;
  theme?: string;
  dueDate?: string;
  createdAt: string;
}

export interface ActivityRecord {
  _id?: string;
  companyId: string;
  userId: string;
  module: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface Decision {
  _id?: string;
  companyId: string;
  title: string;
  description: string;
  decision: string;
  impact: string;
  owner: string;
  status: "pending" | "approved" | "rejected" | "deferred";
  agents?: string[];
  createdAt: string;
}

export interface Report {
  _id?: string;
  companyId: string;
  title?: string;
  reportType: string;
  period?: string;
  summary: string;
  generatedBy: string;
  status?: "ready" | "generating";
  createdAt: string;
}

export interface Competitor {
  _id?: string;
  companyId: string;
  name: string;
  industry: string;
  positioning?: string;
  strengths: string;
  weaknesses: string;
  pricing: string;
  website: string;
  marketShare: number;
  momentum?: "up" | "down" | "flat";
  notes: string;
  createdAt?: string;
}

export interface Notification {
  _id?: string;
  userId: string;
  title: string;
  message: string;
  type: "insight" | "alert" | "report" | "system";
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  _id?: string;
  companyId: string;
  userId: string;
  messages: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}
