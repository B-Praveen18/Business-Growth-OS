import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  ScoreRing,
  MiniProgress,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatusPill,
} from "@/components/app/primitives";
import { GrowthLineChart, FunnelBarChart } from "@/components/app/charts";
import { scores, growthData, funnelData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Route = createFileRoute("/_app/health")({
  component: HealthDashboard,
});

const dimensions = [
  { label: "Growth", value: scores.growth, change: 6, note: "Strong upward momentum in acquisition." },
  { label: "Revenue Opportunity", value: scores.revenueOpportunity, change: 3, note: "Significant untapped expansion revenue." },
  { label: "Lead Quality", value: scores.lead, change: -2, note: "Pipeline quality slightly softened." },
  { label: "Customer Health", value: scores.customerHealth, change: 4, note: "Retention signals improving." },
  { label: "Market Readiness", value: scores.marketReadiness, change: 1, note: "Positioning holding steady." },
  { label: "Financial Resilience", value: 83, change: 5, note: "Runway extended, burn controlled." },
];

function HealthDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Business Health"
        description="A continuous, multi-dimensional read on how your company is really doing."
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <FadeIn>
          <GlassCard glow className="flex h-full flex-col items-center justify-center gap-4 py-10">
            <p className="text-sm font-medium text-muted-foreground">Composite Health Score</p>
            <ScoreRing value={scores.health} size={180} stroke={13} />
            <StatusPill label="+4 pts this month" tone="success" />
            <div className="grid w-full grid-cols-3 gap-3 pt-4 text-center">
              {[
                { l: "Percentile", v: "Top 12%" },
                { l: "Trend", v: "Rising" },
                { l: "Stability", v: "High" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-accent/40 py-3">
                  <p className="text-sm font-semibold">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.05}>
          <GlassCard className="h-full">
            <SectionHeading title="Health Dimensions" description="Six pillars of business performance" />
            <div className="grid gap-4 sm:grid-cols-2">
              {dimensions.map((d) => (
                <div key={d.label} className="rounded-xl border border-border/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{d.label}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {d.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                      ) : d.change < 0 ? (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      ) : (
                        <Minus className="h-3.5 w-3.5" />
                      )}
                      {d.change > 0 ? "+" : ""}
                      {d.change}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-2xl font-semibold">{d.value}</span>
                    <span className="mb-1 text-xs text-muted-foreground">/100</span>
                  </div>
                  <MiniProgress value={d.value} className="mt-2" />
                  <p className="mt-2 text-xs text-muted-foreground">{d.note}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FadeIn delay={0.1}>
          <GlassCard>
            <SectionHeading title="Users & Leads" description="12-month trajectory" />
            <GrowthLineChart data={growthData} />
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.12}>
          <GlassCard>
            <SectionHeading title="Conversion Funnel" description="Visitor to expansion, %" />
            <FunnelBarChart data={funnelData} />
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}
