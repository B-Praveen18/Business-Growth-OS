import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatCard,
} from "@/components/app/primitives";
import { RevenueAreaChart } from "@/components/app/charts";
import { kpis, revenueTrend, decisions, recommendations, risks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download, Share2, Sparkles, TrendingUp, ShieldAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/executive-summary")({
  component: ExecutiveSummary,
});

function ExecutiveSummary() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Summary"
        description="Board-ready narrative of the business — generated the way a chief of staff would write it."
        actions={
          <>
            <Button variant="outline">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </>
        }
      />

      <FadeIn>
        <GlassCard glow className="bg-primary/5">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> This week in one paragraph
          </div>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">
            Northwind Labs is <span className="font-semibold">strong and improving</span>, with a
            composite health score of 87 (+4). MRR reached <span className="font-semibold">$482.9k</span> (+12.4%),
            driven by improving retention and a 24% reduction in acquisition cost via the referral
            channel. The primary opportunity is a usage-based expansion tier modeled at{" "}
            <span className="font-semibold">+$61k MRR</span>. The main risk to watch is rising
            mid-market churn, currently affecting 11 accounts. The AI board recommends prioritizing
            expansion revenue over new-logo acquisition this quarter.
          </p>
        </GlassCard>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.slice(0, 4).map((k) => (
            <StatCard key={k.label} {...k} />
          ))}
        </div>
      </FadeIn>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <FadeIn delay={0.08}>
          <GlassCard>
            <SectionHeading title="Revenue performance" description="Actual vs forecast, $K" />
            <RevenueAreaChart data={revenueTrend} />
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.1}>
          <GlassCard className="h-full">
            <SectionHeading title="Key decisions" />
            <ul className="space-y-3">
              {decisions.map((d) => (
                <li key={d.id} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.outcome} · {d.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </FadeIn>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <FadeIn delay={0.12}>
          <GlassCard>
            <SectionHeading title="Top opportunities" />
            <ul className="space-y-3">
              {recommendations.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.agent} · <span className="text-success">{r.uplift}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.14}>
          <GlassCard>
            <SectionHeading title="Risks to watch" />
            <ul className="space-y-3">
              {risks.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{r.severity} · {r.probability}% probability</p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}
