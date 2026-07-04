import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GlassCard,
  StatCard,
  ScoreRing,
  MiniProgress,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatusPill,
} from "@/components/app/primitives";
import { RevenueAreaChart, ChannelDonut } from "@/components/app/charts";
import { agents } from "@/lib/mock-data";
import { getCurrentUser, User } from "@/lib/auth";
import { getMetrics } from "@/lib/metrics-api";
import { getActivity } from "@/lib/activity-api";
import { getDecisions } from "@/lib/decisions-api";
import { getRisks } from "@/lib/risks-api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Users2,
  Repeat,
  Target,
  Flame,
  Activity as ActivityIcon,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

const kpiIcons = [DollarSign, Users2, Repeat, Target, Flame, ActivityIcon];

function getGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
}

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

const computeScoreCards = (scores: any) => [
  { label: "Growth Score", value: scores.growth, hint: "Momentum across channels" },
  { label: "Revenue Opportunity", value: scores.revenueOpportunity, hint: "Untapped expansion" },
  { label: "Lead Score", value: scores.lead, hint: "Pipeline quality" },
  { label: "Customer Health", value: scores.customerHealth, hint: "Retention signal" },
  { label: "Market Readiness", value: scores.marketReadiness, hint: "Positioning strength" },
];

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    
    async function loadData() {
      try {
        const [metricsRes, activityRes, decisionsRes, risksRes] = await Promise.all([
          getMetrics(),
          getActivity(),
          getDecisions(),
          getRisks(),
        ]);
        setMetrics(metricsRes.metrics || []);
        setActivity(activityRes.activity || []);
        setDecisions(decisionsRes.decisions || []);
        setRisks(risksRes.risks || []);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const businessType = user?.industry?.toLowerCase() ?? "";
  const isBakery = /bakery|cafe|coffee|food/.test(businessType);

  const getVal = (name: string, fallback: number) => {
    const m = metrics.find((x: any) => x.name === name);
    return m ? Number(m.value) : fallback;
  };
  
  const scores = {
    health: getVal('health', 87),
    growth: getVal('growth', 74),
    revenueOpportunity: getVal('revenueOpportunity', 92),
    lead: getVal('lead', 68),
    customerHealth: getVal('customerHealth', 81),
    marketReadiness: getVal('marketReadiness', 79),
  };
  
  const scoreCards = computeScoreCards(scores);

  const kpis = [
    { label: "Monthly Recurring Revenue", value: `₹${getVal('mrr', 482900).toLocaleString()}`, delta: "+12.4%", trend: "up" as const },
    { label: "Active Customers", value: getVal('customers', 3284).toLocaleString(), delta: "+4.1%", trend: "up" as const },
    { label: "Net Revenue Retention", value: `${getVal('nrr', 118)}%`, delta: "+2.3%", trend: "up" as const },
    { label: "Customer Acquisition Cost", value: `₹${getVal('cac', 212)}`, delta: "-8.7%", trend: "up" as const },
    { label: "Burn Multiple", value: `${getVal('burnMultiple', 1.2)}x`, delta: "-0.3x", trend: "up" as const },
    { label: "Churn Rate", value: `${getVal('churnRate', 1.9)}%`, delta: "+0.4%", trend: "down" as const },
  ];

  const activeRisks = risks.filter(r => r.status !== 'mitigated');
  const highAlertsCount = activeRisks.filter(r => r.severity === 'high' || r.severity === 'critical').length;
  const mediumAlertsCount = activeRisks.filter(r => r.severity === 'medium').length;

  const revenueTrend = metrics.find(m => m.name === 'revenueTrend')?.history || [
    { month: "Jan", revenue: 312, forecast: 300, target: 320 },
    { month: "Feb", revenue: 328, forecast: 325, target: 340 },
    { month: "Mar", revenue: 355, forecast: 350, target: 360 },
    { month: "Apr", revenue: 372, forecast: 378, target: 385 },
    { month: "May", revenue: 401, forecast: 405, target: 410 },
    { month: "Jun", revenue: 428, forecast: 430, target: 440 },
    { month: "Jul", revenue: 451, forecast: 458, target: 465 },
    { month: "Aug", revenue: 483, forecast: 486, target: 495 },
  ];

  const channelData = metrics.find(m => m.name === 'channelData')?.history || [
    { name: "Organic", value: 38, color: "var(--chart-1)" },
    { name: "Paid", value: 26, color: "var(--chart-2)" },
    { name: "Referral", value: 21, color: "var(--chart-3)" },
    { name: "Outbound", value: 15, color: "var(--chart-4)" },
  ];
  
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={user ? `${getGreeting()}, ${user.name}` : getGreeting()}
        description={
          user
            ? `Here's how ${user.company} is performing today. Your AI board is standing by.`
            : "Here's how your business is performing today. Your AI board is standing by."
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/executive-summary">Executive summary</Link>
            </Button>
            <Button asChild>
              <Link to="/boardroom">
                <Sparkles className="h-4 w-4" /> Ask the board
              </Link>
            </Button>
          </>
        }
      />

      {user && (
        <FadeIn>
          <GlassCard className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Signed in as</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">{user.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-sm text-muted-foreground">{user.company}</p>
            </div>
            <div className="rounded-3xl bg-secondary/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">BusinessOS account</p>
              <p className="mt-2">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Hero: health + scores */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_2fr]">
        <FadeIn>
          <GlassCard glow className="flex h-full flex-col items-center justify-center gap-3 py-8">
            <p className="text-sm font-medium text-muted-foreground">Business Health Score</p>
            <ScoreRing value={scores.health} size={168} stroke={12} />
            <StatusPill label="Strong & improving" tone="success" />
            <p className="max-w-xs text-center text-xs text-muted-foreground">
              Up 4 points this month, driven by retention and revenue efficiency.
            </p>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid h-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {scoreCards.map((s) => (
              <GlassCard key={s.label} hover className="flex flex-col justify-between gap-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-semibold tracking-tight">{s.value}</span>
                    <span className="mb-1 text-xs text-muted-foreground">/100</span>
                  </div>
                  <MiniProgress value={s.value} className="mt-2" />
                  <p className="mt-2 text-xs text-muted-foreground">{s.hint}</p>
                </div>
              </GlassCard>
            ))}
            <GlassCard hover className="flex flex-col justify-between gap-2 bg-primary/5">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <ShieldAlert className="h-4 w-4" /> Risk Alerts
              </div>
              <div>
                <span className="text-3xl font-semibold tracking-tight">{activeRisks.length}</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  {highAlertsCount} high · {mediumAlertsCount} medium
                </p>
              </div>
              <Link to="/risk" className="text-xs font-medium text-primary hover:underline">
                Review risks →
              </Link>
            </GlassCard>
          </div>
        </FadeIn>
      </div>

      {/* Industry-aware operations */}
      <FadeIn delay={0.1}>
        <SectionHeading
          title={isBakery ? "Bakery operations" : "Business operations"}
          description={
            isBakery
              ? "Fresh inventory, prep efficiency, and customer demand for your bakery."
              : "Top operational signals matched to your industry."
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={isBakery ? "Daily loaves" : "Monthly orders"}
            value={isBakery ? "312" : "1.4k"}
            icon={isBakery ? Flame : Repeat}
          />
          <StatCard
            label={isBakery ? "Fresh batches" : "Customer growth"}
            value={isBakery ? "24" : "18%"}
            icon={isBakery ? Sparkles : Users2}
          />
          <StatCard
            label={isBakery ? "Ingredient waste" : "Customer retention"}
            value={isBakery ? "4%" : "83%"}
            icon={isBakery ? DollarSign : Target}
          />
          <StatCard
            label={isBakery ? "Peak service" : "Revenue per user"}
            value={isBakery ? "9:00 AM" : "₹7.8k"}
            icon={isBakery ? ActivityIcon : Flame}
          />
        </div>
      </FadeIn>

      {/* KPIs */}
      <FadeIn delay={0.12}>
        <SectionHeading title="Business KPIs" description="Live metrics across the company" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k, i) => (
            <StatCard key={k.label} {...k} icon={kpiIcons[i]} />
          ))}
        </div>
      </FadeIn>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <FadeIn delay={0.12}>
          <GlassCard>
            <SectionHeading
              title="Revenue Trends"
              description={isBakery ? "Daily sales, prep capacity and freshness curve." : "Actual vs AI forecast · in ₹K"}
              action={<StatusPill label="On track" tone="success" />}
            />
            <RevenueAreaChart data={revenueTrend} />
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.15}>
          <GlassCard>
            <SectionHeading title="Acquisition Mix" description="By channel" />
            <ChannelDonut data={channelData} />
          </GlassCard>
        </FadeIn>
      </div>

      {/* Agent status */}
      <FadeIn delay={0.16}>
        <SectionHeading
          title="Agent Status"
          description="Your AI executive team"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/boardroom">
                Boardroom <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {agents.map((a) => (
            <Link key={a.id} to="/agents/$agentId" params={{ agentId: a.id }}>
              <GlassCard hover className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ background: `color-mix(in oklab, ${a.accent} 20%, transparent)` }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: a.accent }} />
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      a.status === "active" && "bg-success/15 text-success",
                      a.status === "analyzing" && "bg-info/15 text-info",
                      a.status === "idle" && "bg-muted text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        a.status === "active" && "bg-success",
                        a.status === "analyzing" && "bg-info animate-pulse",
                        a.status === "idle" && "bg-muted-foreground",
                      )}
                    />
                    {a.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{a.summary}</p>
                <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground">
                  <span>{a.tasks} tasks</span>
                  <span>{a.confidence}% confidence</span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* Activity + decisions + summary */}
      <div className="grid gap-5 lg:grid-cols-3">
        <FadeIn delay={0.18} className="lg:col-span-2">
          <GlassCard className="h-full">
            <SectionHeading title="Activity Timeline" description="What your AI team did recently" />
            <ol className="relative space-y-5 pl-6">
              <span className="absolute left-[7px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
              {activity.slice(0, 6).map((a) => {
                const mappedType = a.type || a.module;
                return (
                  <li key={a._id || a.id} className="relative">
                    <span
                      className={cn(
                        "absolute -left-6 top-1 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-background",
                        mappedType === "decision" && "bg-primary",
                        mappedType === "insight" && "bg-info",
                        mappedType === "alert" && "bg-warning",
                        mappedType === "report" && "bg-success",
                      )}
                    />
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm">
                        <span className="font-medium">{a.userId || a.actor}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">{a.createdAt ? formatTime(a.createdAt) : a.time}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex h-full flex-col gap-5">
            <GlassCard>
              <SectionHeading title="Recent Decisions" />
              <ul className="space-y-3">
                {decisions.map((d) => (
                  <li key={d._id || d.id} className="flex items-start gap-3">
                    <CheckCircle2
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        d.outcome === "Approved" ? "text-success" : "text-warning",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.outcome} · {(d.agents || []).join(", ")} · {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : d.date}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="bg-primary/5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="h-4 w-4 text-primary" /> Top Recommendation
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Launch a usage-based expansion tier — modeled to add{" "}
                <span className="font-medium text-foreground">+₹61k MRR</span>.
              </p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link to="/recommendations">See all recommendations</Link>
              </Button>
            </GlassCard>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
