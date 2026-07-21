// seed-demo-data.js
// Usage: node seed-demo-data.js "Your Company Name" "your-login-email@example.com"
// This inserts demo data into every collection your app reads,
// scoped to the given companyId (must match the "company" field
// you used when registering your user via /api/auth/register).
// The email arg is only needed for AI Recommendations (suggestions
// are keyed by userEmail, not companyId) — pass the exact email you log in with.

import { MongoClient } from "mongodb";

const MONGO_URI = process.env.VITE_MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.VITE_MONGO_DB || "businessos";
const companyId = process.argv[2] || "Acme Robotics";
const userEmail = (process.argv[3] || "").trim().toLowerCase();

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

  // --- Named KPI/score docs the Dashboard, Analytics, and Health pages
  // look up by `name` (via getVal(name, fallback)). Without these, those
  // pages silently show hardcoded fallback demo numbers instead of your data.
  await db.collection("metrics").insertMany([
    { companyId, name: "health", value: 92, createdAt: now, updatedAt: now },
    { companyId, name: "growth", value: 81, createdAt: now, updatedAt: now },
    { companyId, name: "revenueOpportunity", value: 88, createdAt: now, updatedAt: now },
    { companyId, name: "lead", value: 76, createdAt: now, updatedAt: now },
    { companyId, name: "customerHealth", value: 85, createdAt: now, updatedAt: now },
    { companyId, name: "marketReadiness", value: 83, createdAt: now, updatedAt: now },
    { companyId, name: "mrr", value: 512300, createdAt: now, updatedAt: now },
    { companyId, name: "customers", value: 1305, createdAt: now, updatedAt: now },
    { companyId, name: "nrr", value: 121, createdAt: now, updatedAt: now },
    { companyId, name: "cac", value: 198, createdAt: now, updatedAt: now },
    { companyId, name: "burnMultiple", value: 1.1, createdAt: now, updatedAt: now },
    { companyId, name: "churnRate", value: 2.6, createdAt: now, updatedAt: now },
    {
      companyId, name: "revenueTrend", createdAt: now, updatedAt: now,
      history: [
        { month: "Jan", revenue: 312, forecast: 300, target: 320 },
        { month: "Feb", revenue: 328, forecast: 325, target: 340 },
        { month: "Mar", revenue: 355, forecast: 350, target: 360 },
        { month: "Apr", revenue: 372, forecast: 378, target: 385 },
        { month: "May", revenue: 401, forecast: 405, target: 410 },
        { month: "Jun", revenue: 428, forecast: 430, target: 440 },
        { month: "Jul", revenue: 451, forecast: 458, target: 465 },
        { month: "Aug", revenue: 483, forecast: 486, target: 495 },
      ],
    },
    {
      companyId, name: "channelData", createdAt: now, updatedAt: now,
      history: [
        { name: "Organic", value: 41, color: "var(--chart-1)" },
        { name: "Paid", value: 24, color: "var(--chart-2)" },
        { name: "Referral", value: 23, color: "var(--chart-3)" },
        { name: "Outbound", value: 12, color: "var(--chart-4)" },
      ],
    },
    {
      companyId, name: "growthData", createdAt: now, updatedAt: now,
      history: [
        { month: "Jan", users: 820, leads: 310 }, { month: "Feb", users: 910, leads: 350 },
        { month: "Mar", users: 1005, leads: 390 }, { month: "Apr", users: 1120, leads: 430 },
        { month: "May", users: 1180, leads: 460 }, { month: "Jun", users: 1240, leads: 500 },
        { month: "Jul", users: 1305, leads: 540 },
      ],
    },
    {
      companyId, name: "funnelData", createdAt: now, updatedAt: now,
      history: [
        { stage: "Visitors", value: 100 },
        { stage: "Signups", value: 58 },
        { stage: "Activated", value: 39 },
        { stage: "Paying", value: 22 },
        { stage: "Expansion", value: 10 },
      ],
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
    {
      companyId,
      title: "Competitor undercutting on price",
      description: "NimbleCo launched a self-serve tier 30% cheaper than our entry plan.",
      severity: "medium", probability: 55, category: "market",
      owner: "Marketing Agent", mitigation: "Reposition entry tier value prop, bundle onboarding support.",
      status: "open", dueDate: "2026-08-20", createdAt: now,
    },
    {
      companyId,
      title: "Key engineer attrition risk",
      description: "Lead backend engineer has an open offer elsewhere.",
      severity: "critical", probability: 40, category: "operations",
      owner: "Operations Agent", mitigation: "Retention conversation + equity refresh this week.",
      status: "open", dueDate: "2026-07-20", createdAt: now,
    },
    {
      companyId,
      title: "Late invoicing delaying cash collection",
      description: "Average days-to-invoice increased from 4 to 11 days last month.",
      severity: "low", probability: 30, category: "finance",
      owner: "Finance Agent", mitigation: "Automate invoice generation on contract signature.",
      status: "mitigated", dueDate: "2026-07-01", createdAt: now,
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
    {
      companyId,
      title: "Migrate CI pipeline to reduce build time",
      description: "Cut average build time from 14 min to under 5 min.",
      priority: "low", status: "done", assignee: "Operations Agent",
      progress: 100, quarter: "Q2", theme: "Efficiency", dueDate: "2026-06-15", createdAt: now,
    },
    {
      companyId,
      title: "Enterprise SSO support",
      description: "Add SAML/SSO to unblock two enterprise deals in pipeline.",
      priority: "high", status: "upcoming", assignee: "Sales Agent",
      progress: 5, quarter: "Q4", theme: "Growth", dueDate: "2026-10-30", createdAt: now,
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
    {
      companyId,
      name: "DataForge", industry: "SaaS Analytics", positioning: "Developer-first",
      strengths: "Strong API, popular with technical buyers",
      weaknesses: "Weak UI for non-technical stakeholders",
      pricing: "Usage-based, $0.02/event",
      website: "https://dataforge.example.com", marketShare: 9, momentum: "up",
      notes: "Emerging threat in the developer-tools-adjacent segment.", createdAt: now,
    },
  ]);

  // --- AI Recommendations (suggestions collection, keyed by userEmail) ---
  if (userEmail) {
    await db.collection("suggestions").insertMany([
      {
        userEmail,
        title: "Bundle onboarding support into entry-tier pricing",
        description: "Counter NimbleCo's price undercutting by bundling white-glove onboarding into your entry tier instead of competing purely on price.",
        category: "revenue", createdAt: now, status: "pending",
        impact: "high", priority: "high",
      },
      {
        userEmail,
        title: "Automate invoice generation on contract signature",
        description: "Cut days-to-invoice from 11 back to under 5 by triggering invoicing automatically when a deal closes in the CRM.",
        category: "efficiency", createdAt: now, status: "pending",
        impact: "medium", priority: "medium",
      },
      {
        userEmail,
        title: "Prioritize SSO for enterprise deals",
        description: "Two enterprise deals in pipeline are blocked on SSO support — shipping this could unlock immediate expansion revenue.",
        category: "growth", createdAt: now, status: "pending",
        impact: "high", priority: "high",
      },
      {
        userEmail,
        title: "Diversify top-account revenue concentration",
        description: "Top 3 accounts are 41% of revenue — start a mid-market outbound motion to reduce single-account risk.",
        category: "risk", createdAt: now, status: "pending",
        impact: "medium", priority: "medium",
      },
      {
        userEmail,
        title: "Retention conversation with at-risk engineer",
        description: "A key backend engineer has a competing offer — schedule a retention conversation with equity refresh this week.",
        category: "operations", createdAt: now, status: "accepted",
        impact: "high", priority: "high",
      },
    ]);
  } else {
    console.log("Skipped AI Recommendations seed — pass a userEmail as the 2nd argument to include them.");
  }

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

  console.log("Seed complete. Collections populated: metrics, risks, roadmap, competitors, decisions, reports, notifications" + (userEmail ? ", suggestions" : "") + ".");
  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
