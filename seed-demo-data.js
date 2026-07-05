// seed-demo-data.js
// Usage: node seed-demo-data.js "Your Company Name"
// This inserts demo data into every collection your app reads,
// scoped to the given companyId (must match the "company" field
// you used when registering your user via /api/auth/register).

import { MongoClient } from "mongodb";

const MONGO_URI = process.env.VITE_MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.VITE_MONGO_DB || "businessos";
const companyId = process.argv[2] || "Acme Robotics";

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(MONGO_DB);
  const now = new Date().toISOString();

  console.log(`Seeding demo data for companyId="${companyId}" into db "${MONGO_DB}"...`);

  // --- Metrics (time series, most recent 3 months) ---
  await db.collection("metrics").insertMany([
    {
      companyId, month: "May", revenue: 401000, profit: 62000, customers: 1180,
      growthRate: 12.4, burnRate: 85000, runway: 18, employeeCount: 24,
      churnRate: 3.1, forecast: 405000, target: 410000, leads: 340,
      createdAt: now, updatedAt: now,
    },
    {
      companyId, month: "Jun", revenue: 428000, profit: 71000, customers: 1240,
      growthRate: 13.9, burnRate: 88000, runway: 17, employeeCount: 26,
      churnRate: 2.8, forecast: 430000, target: 440000, leads: 365,
      createdAt: now, updatedAt: now,
    },
    {
      companyId, month: "Jul", revenue: 451000, profit: 79000, customers: 1305,
      growthRate: 14.7, burnRate: 90000, runway: 16, employeeCount: 27,
      churnRate: 2.6, forecast: 458000, target: 465000, leads: 390,
      createdAt: now, updatedAt: now,
    },
  ]);

  // --- Risks ---
  await db.collection("risks").insertMany([
    {
      companyId,
      title: "Key vendor price increase",
      description: "Primary cloud infra vendor announced a 20% price hike effective next quarter.",
      severity: "high", probability: 70, category: "operations",
      owner: "Operations Agent", mitigation: "Evaluate alternate providers and negotiate committed-use discount.",
      status: "open", dueDate: "2026-08-15", createdAt: now,
    },
    {
      companyId,
      title: "Customer concentration risk",
      description: "Top 3 accounts represent 41% of total revenue.",
      severity: "medium", probability: 45, category: "finance",
      owner: "Finance Agent", mitigation: "Accelerate diversification via mid-market segment expansion.",
      status: "open", dueDate: "2026-09-01", createdAt: now,
    },
  ]);

  // --- Roadmap ---
  await db.collection("roadmap").insertMany([
    {
      companyId,
      title: "Launch usage-based pricing tier",
      description: "New metered pricing tier for expansion accounts.",
      priority: "high", status: "active", assignee: "Finance Agent",
      progress: 55, quarter: "Q3", theme: "Monetization", dueDate: "2026-08-30", createdAt: now,
    },
    {
      companyId,
      title: "Automate onboarding handoff",
      description: "Reduce manual steps between sales close and onboarding kickoff.",
      priority: "medium", status: "active", assignee: "Operations Agent",
      progress: 30, quarter: "Q3", theme: "Efficiency", dueDate: "2026-09-15", createdAt: now,
    },
    {
      companyId,
      title: "Referral program relaunch",
      description: "Refresh incentive structure for the referral channel.",
      priority: "medium", status: "upcoming", assignee: "Marketing Agent",
      progress: 0, quarter: "Q4", theme: "Growth", dueDate: "2026-10-10", createdAt: now,
    },
  ]);

  // --- Competitors ---
  await db.collection("competitors").insertMany([
    {
      companyId,
      name: "RivalTech", industry: "SaaS Analytics", positioning: "Enterprise-first",
      strengths: "Strong enterprise sales team, deep integrations",
      weaknesses: "Slow release cadence, expensive onboarding",
      pricing: "Custom enterprise contracts, $50k+/yr",
      website: "https://rivaltech.example.com", marketShare: 22, momentum: "flat",
      notes: "Recently lost a major logo to us in the mid-market segment.", createdAt: now,
    },
    {
      companyId,
      name: "NimbleCo", industry: "SaaS Analytics", positioning: "SMB self-serve",
      strengths: "Low price point, fast signup flow",
      weaknesses: "Limited enterprise features, weaker support",
      pricing: "$29-$99/mo self-serve tiers",
      website: "https://nimbleco.example.com", marketShare: 15, momentum: "up",
      notes: "Growing fast in the SMB segment we're also targeting.", createdAt: now,
    },
  ]);

  // --- Decisions ---
  await db.collection("decisions").insertMany([
    {
      companyId,
      title: "Prioritize expansion revenue over new logo acquisition",
      description: "Board debate on where to focus Q3 resources.",
      decision: "Focus on the 34 identified expansion accounts before new customer acquisition spend.",
      impact: "Projected +8% revenue growth with lower CAC.",
      owner: "CEO Agent", status: "approved",
      agents: ["ceo", "sales", "finance"], createdAt: now,
    },
  ]);

  // --- Reports ---
  await db.collection("reports").insertMany([
    {
      companyId,
      title: "Q2 Board Report", reportType: "quarterly", period: "Q2 2026",
      summary: "Revenue grew 14.7% QoQ, runway steady at 16 months, churn improved to 2.6%.",
      generatedBy: "CEO Agent", status: "ready", createdAt: now,
    },
  ]);

  // --- Notifications (replace USER_ID_HERE with a real user _id after you register) ---
  await db.collection("notifications").insertMany([
    {
      userId: "demo-user",
      title: "New risk flagged", message: "Key vendor price increase needs review.",
      type: "alert", read: false, createdAt: now,
    },
    {
      userId: "demo-user",
      title: "Report ready", message: "Q2 Board Report has been generated.",
      type: "report", read: false, createdAt: now,
    },
  ]);

  console.log("Seed complete. Collections populated: metrics, risks, roadmap, competitors, decisions, reports, notifications.");
  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
