// Static presentation data for the BusinessOS frontend.

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "analyzing" | "idle";
  summary: string;
  accent: string;
  tasks: number;
  confidence: number;
}

export const agents: Agent[] = [
  {
    id: "ceo",
    name: "CEO Agent",
    role: "Strategic orchestration",
    status: "active",
    summary: "Coordinating quarterly strategy across all departments.",
    accent: "var(--chart-1)",
    tasks: 8,
    confidence: 94,
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    role: "Demand & brand",
    status: "analyzing",
    summary: "Optimizing paid spend allocation for Q3 campaigns.",
    accent: "var(--chart-5)",
    tasks: 12,
    confidence: 88,
  },
  {
    id: "sales",
    name: "Sales Agent",
    role: "Pipeline & revenue",
    status: "active",
    summary: "Prioritizing 34 high-intent accounts in the pipeline.",
    accent: "var(--chart-3)",
    tasks: 19,
    confidence: 91,
  },
  {
    id: "finance",
    name: "Finance Agent",
    role: "Capital & runway",
    status: "idle",
    summary: "Runway healthy at 22 months. Monitoring burn multiple.",
    accent: "var(--chart-4)",
    tasks: 5,
    confidence: 96,
  },
  {
    id: "operations",
    name: "Operations Agent",
    role: "Efficiency & delivery",
    status: "analyzing",
    summary: "Detecting bottleneck in onboarding workflow stage 3.",
    accent: "var(--chart-2)",
    tasks: 9,
    confidence: 85,
  },
];

export interface Recommendation {
  id: string;
  title: string;
  agent: string;
  impact: "High" | "Medium" | "Low";
  effort: "Low" | "Medium" | "High";
  category: string;
  description: string;
  uplift: string;
}
