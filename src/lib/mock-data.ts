// Static presentation data for the Aurelia frontend. No backend, no APIs.

export const company = {
  name: "Northwind Labs",
  plan: "Enterprise",
  founder: "Alex Rivera",
  role: "Founder & CEO",
  initials: "AR",
};

export const scores = {
  health: 87,
  growth: 74,
  revenueOpportunity: 92,
  lead: 68,
  customerHealth: 81,
  marketReadiness: 79,
};

export const kpis = [
  { label: "Monthly Recurring Revenue", value: "$482,900", delta: "+12.4%", trend: "up" as const },
  { label: "Active Customers", value: "3,284", delta: "+4.1%", trend: "up" as const },
  { label: "Net Revenue Retention", value: "118%", delta: "+2.3%", trend: "up" as const },
  { label: "Customer Acquisition Cost", value: "$212", delta: "-8.7%", trend: "up" as const },
  { label: "Burn Multiple", value: "1.2x", delta: "-0.3x", trend: "up" as const },
  { label: "Churn Rate", value: "1.9%", delta: "+0.4%", trend: "down" as const },
];

export const revenueTrend = [
  { month: "Jan", revenue: 312, forecast: 300, target: 320 },
  { month: "Feb", revenue: 328, forecast: 325, target: 340 },
  { month: "Mar", revenue: 355, forecast: 350, target: 360 },
  { month: "Apr", revenue: 372, forecast: 378, target: 385 },
  { month: "May", revenue: 401, forecast: 405, target: 410 },
  { month: "Jun", revenue: 428, forecast: 430, target: 440 },
  { month: "Jul", revenue: 451, forecast: 458, target: 465 },
  { month: "Aug", revenue: 483, forecast: 486, target: 495 },
];

export const growthData = [
  { month: "Jan", users: 1820, leads: 640 },
  { month: "Feb", users: 2010, leads: 720 },
  { month: "Mar", users: 2240, leads: 810 },
  { month: "Apr", users: 2490, leads: 905 },
  { month: "May", users: 2760, leads: 1010 },
  { month: "Jun", users: 2980, leads: 1120 },
  { month: "Jul", users: 3130, leads: 1240 },
  { month: "Aug", users: 3284, leads: 1360 },
];

export const channelData = [
  { name: "Organic", value: 38, color: "var(--chart-1)" },
  { name: "Paid", value: 26, color: "var(--chart-2)" },
  { name: "Referral", value: 21, color: "var(--chart-3)" },
  { name: "Outbound", value: 15, color: "var(--chart-4)" },
];

export const funnelData = [
  { stage: "Visitors", value: 100 },
  { stage: "Signups", value: 62 },
  { stage: "Activated", value: 41 },
  { stage: "Paying", value: 24 },
  { stage: "Expansion", value: 11 },
];

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

export const recommendations: Recommendation[] = [
  {
    id: "r1",
    title: "Launch usage-based expansion tier",
    agent: "Finance Agent",
    impact: "High",
    effort: "Medium",
    category: "Pricing",
    description:
      "Introduce a metered add-on for power users. Analysis of top accounts shows willingness to pay for overage.",
    uplift: "+$61k MRR",
  },
  {
    id: "r2",
    title: "Reallocate 18% of paid spend to referral",
    agent: "Marketing Agent",
    impact: "High",
    effort: "Low",
    category: "Growth",
    description:
      "Referral channel shows 2.4x better CAC efficiency. Shift budget from underperforming paid social.",
    uplift: "-24% CAC",
  },
  {
    id: "r3",
    title: "Automate onboarding stage 3 handoff",
    agent: "Operations Agent",
    impact: "Medium",
    effort: "Medium",
    category: "Efficiency",
    description:
      "Manual handoff adds 3.2 days to activation. Automating unblocks time-to-value for new cohorts.",
    uplift: "+9% activation",
  },
  {
    id: "r4",
    title: "Target 34 enterprise accounts for expansion",
    agent: "Sales Agent",
    impact: "High",
    effort: "Medium",
    category: "Sales",
    description:
      "High-intent signals detected across 34 existing accounts nearing seat limits.",
    uplift: "+$88k ARR",
  },
];

export interface RiskItem {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  probability: number;
  description: string;
}

export const risks: RiskItem[] = [
  {
    id: "k1",
    title: "Rising churn in mid-market segment",
    severity: "high",
    category: "Retention",
    probability: 62,
    description: "Mid-market churn up 0.4pts. Early warning signals in 11 accounts.",
  },
  {
    id: "k2",
    title: "Single-vendor cloud dependency",
    severity: "medium",
    category: "Operations",
    probability: 38,
    description: "84% of infrastructure on one provider. Consider multi-region redundancy.",
  },
  {
    id: "k3",
    title: "Competitor undercutting on price",
    severity: "medium",
    category: "Market",
    probability: 45,
    description: "New entrant pricing 20% below market in SMB tier.",
  },
  {
    id: "k4",
    title: "Key-person concentration in engineering",
    severity: "low",
    category: "Team",
    probability: 22,
    description: "Critical knowledge concentrated in 2 senior engineers.",
  },
];

export interface Competitor {
  name: string;
  positioning: string;
  marketShare: number;
  momentum: "up" | "down" | "flat";
  strength: string;
  weakness: string;
}

export const competitors: Competitor[] = [
  {
    name: "Vantage AI",
    positioning: "Enterprise incumbent",
    marketShare: 34,
    momentum: "flat",
    strength: "Brand & distribution",
    weakness: "Slow product velocity",
  },
  {
    name: "Nimbus",
    positioning: "SMB challenger",
    marketShare: 19,
    momentum: "up",
    strength: "Aggressive pricing",
    weakness: "Thin enterprise features",
  },
  {
    name: "Cordevelo",
    positioning: "Developer-first",
    marketShare: 12,
    momentum: "up",
    strength: "API ecosystem",
    weakness: "Limited GTM",
  },
  {
    name: "Legacy Suite",
    positioning: "Legacy platform",
    marketShare: 15,
    momentum: "down",
    strength: "Installed base",
    weakness: "Aging UX",
  },
];

export interface RoadmapPhase {
  quarter: string;
  theme: string;
  status: "done" | "active" | "upcoming";
  items: { title: string; owner: string }[];
}

export const roadmap: RoadmapPhase[] = [
  {
    quarter: "Q1 2026",
    theme: "Foundation & Retention",
    status: "done",
    items: [
      { title: "Ship customer health scoring", owner: "Ops" },
      { title: "Reduce mid-market churn", owner: "Sales" },
    ],
  },
  {
    quarter: "Q2 2026",
    theme: "Expansion Revenue",
    status: "active",
    items: [
      { title: "Launch usage-based pricing tier", owner: "Finance" },
      { title: "Expansion playbook for 34 accounts", owner: "Sales" },
      { title: "Referral program relaunch", owner: "Marketing" },
    ],
  },
  {
    quarter: "Q3 2026",
    theme: "Market Leadership",
    status: "upcoming",
    items: [
      { title: "Enterprise security certifications", owner: "Ops" },
      { title: "Partner marketplace beta", owner: "CEO" },
    ],
  },
  {
    quarter: "Q4 2026",
    theme: "Scale & Efficiency",
    status: "upcoming",
    items: [
      { title: "Multi-region infrastructure", owner: "Ops" },
      { title: "Automated financial forecasting", owner: "Finance" },
    ],
  },
];

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  time: string;
  type: "decision" | "insight" | "alert" | "report";
}

export const activity: ActivityEntry[] = [
  { id: "a1", actor: "CEO Agent", action: "Approved Q3 strategic priorities", time: "12m ago", type: "decision" },
  { id: "a2", actor: "Marketing Agent", action: "Flagged CAC spike in paid social", time: "48m ago", type: "alert" },
  { id: "a3", actor: "Finance Agent", action: "Generated monthly runway report", time: "2h ago", type: "report" },
  { id: "a4", actor: "Sales Agent", action: "Identified 34 expansion-ready accounts", time: "4h ago", type: "insight" },
  { id: "a5", actor: "Operations Agent", action: "Detected onboarding bottleneck", time: "6h ago", type: "alert" },
  { id: "a6", actor: "Alex Rivera", action: "Reviewed executive summary", time: "Yesterday", type: "decision" },
  { id: "a7", actor: "CEO Agent", action: "Synthesized boardroom recommendation", time: "Yesterday", type: "insight" },
];

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: "insight" | "alert" | "report" | "system";
}

export const notifications: NotificationItem[] = [
  { id: "n1", title: "New high-impact recommendation", body: "Finance Agent suggests a usage-based expansion tier worth +$61k MRR.", time: "8m ago", unread: true, type: "insight" },
  { id: "n2", title: "Churn risk detected", body: "11 mid-market accounts showing early churn signals.", time: "35m ago", unread: true, type: "alert" },
  { id: "n3", title: "Weekly report ready", body: "Your executive summary for this week is available.", time: "1h ago", unread: true, type: "report" },
  { id: "n4", title: "Boardroom session complete", body: "AI Boardroom reached consensus on Q3 priorities.", time: "3h ago", unread: true, type: "insight" },
  { id: "n5", title: "CAC efficiency improved", body: "Referral channel now 2.4x more efficient than paid.", time: "5h ago", unread: true, type: "insight" },
  { id: "n6", title: "New competitor movement", body: "Nimbus launched a new SMB pricing tier.", time: "Yesterday", unread: true, type: "alert" },
  { id: "n7", title: "Backup completed", body: "Your workspace data was backed up successfully.", time: "Yesterday", unread: false, type: "system" },
];

export interface Decision {
  id: string;
  title: string;
  outcome: string;
  agents: string[];
  date: string;
}

export const decisions: Decision[] = [
  { id: "d1", title: "Prioritize expansion over new logos in Q3", outcome: "Approved", agents: ["CEO", "Sales", "Finance"], date: "Aug 2" },
  { id: "d2", title: "Relaunch referral program", outcome: "Approved", agents: ["Marketing", "Finance"], date: "Jul 28" },
  { id: "d3", title: "Delay international expansion", outcome: "Deferred", agents: ["CEO", "Ops"], date: "Jul 21" },
];

export interface Report {
  id: string;
  title: string;
  period: string;
  type: string;
  status: "ready" | "generating";
}

export const reports: Report[] = [
  { id: "rp1", title: "Executive Monthly Review", period: "August 2026", type: "Executive", status: "ready" },
  { id: "rp2", title: "Revenue & Growth Deep Dive", period: "Q2 2026", type: "Finance", status: "ready" },
  { id: "rp3", title: "Customer Health Report", period: "August 2026", type: "Retention", status: "ready" },
  { id: "rp4", title: "Competitive Landscape", period: "Q2 2026", type: "Market", status: "ready" },
  { id: "rp5", title: "Q3 Forecast Model", period: "Q3 2026", type: "Finance", status: "generating" },
];
