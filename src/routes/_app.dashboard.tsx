import { createFileRoute, Link } from "@tanstack/react-router";
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
import {
  scores,
  kpis,
  revenueTrend,
  channelData,
  agents,
  activity,
  decisions,
} from "@/lib/mock-data";
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

const scoreCards = [
  { label: "Growth Score", value: scores.growth, hint: "Momentum across channels" },
  { label: "Revenue Opportunity", value: scores.revenueOpportunity, hint: "Untapped expansion" },
  { label: "Lead Score", value: scores.lead, hint: "Pipeline quality" },
  { label: "Customer Health", value: scores.customerHealth, hint: "Retention signal" },
  { label: "Market Readiness", value: scores.marketReadiness, hint: "Positioning strength" },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Good morning, Alex"
        description="Here's how Northwind Labs is performing today. Your AI board is standing by."
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
                <span className="text-3xl font-semibold tracking-tight">3</span>
                <p className="mt-1 text-xs text-muted-foreground">1 high · 2 medium</p>
              </div>
              <Link to="/risk" className="text-xs font-medium text-primary hover:underline">
                Review risks →
              </Link>
            </GlassCard>
          </div>
        </FadeIn>
      </div>

      {/* KPIs */}
      <FadeIn delay={0.1}>
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
              description="Actual vs AI forecast · in $K"
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
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-6 top-1 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-background",
                      a.type === "decision" && "bg-primary",
                      a.type === "insight" && "bg-info",
                      a.type === "alert" && "bg-warning",
                      a.type === "report" && "bg-success",
                    )}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex h-full flex-col gap-5">
            <GlassCard>
              <SectionHeading title="Recent Decisions" />
              <ul className="space-y-3">
                {decisions.map((d) => (
                  <li key={d.id} className="flex items-start gap-3">
                    <CheckCircle2
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        d.outcome === "Approved" ? "text-success" : "text-warning",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.outcome} · {d.agents.join(", ")} · {d.date}
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
                <span className="font-medium text-foreground">+$61k MRR</span>.
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
