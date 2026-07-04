import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatCard,
} from "@/components/app/primitives";
import { RevenueAreaChart } from "@/components/app/charts";
import { useEffect, useState } from "react";
import { getMetrics } from "@/lib/metrics-api";
import { getDecisions } from "@/lib/decisions-api";
import { getRisks } from "@/lib/risks-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Share2, Sparkles, TrendingUp, ShieldAlert, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/executive-summary")({
  component: ExecutiveSummary,
});

function ExecutiveSummary() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsRes, decisionsRes, risksRes] = await Promise.all([
          getMetrics(),
          getDecisions(),
          getRisks(),
        ]);
        setMetrics(metricsRes.metrics || []);
        setDecisions(decisionsRes.decisions || []);
        setRisks(risksRes.risks || []);
      } catch (err) {
        toast.error("Failed to load executive summary");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getVal = (name: string, fallback: number) => {
    const m = metrics.find((x: any) => x.name === name);
    return m ? Number(m.value) : fallback;
  };

  const kpis = [
    { label: "Monthly Recurring Revenue", value: `₹${getVal('mrr', 482900).toLocaleString()}`, delta: "+12.4%", trend: "up" as const },
    { label: "Active Customers", value: getVal('customers', 3284).toLocaleString(), delta: "+4.1%", trend: "up" as const },
    { label: "Net Revenue Retention", value: `${getVal('nrr', 118)}%`, delta: "+2.3%", trend: "up" as const },
    { label: "Customer Acquisition Cost", value: `₹${getVal('cac', 212)}`, delta: "-8.7%", trend: "up" as const },
    { label: "Burn Multiple", value: `${getVal('burnMultiple', 1.2)}x`, delta: "-0.3x", trend: "up" as const },
    { label: "Churn Rate", value: `${getVal('churnRate', 1.9)}%`, delta: "+0.4%", trend: "down" as const },
  ];

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

  const recommendations = [
    {
      id: "r1",
      title: "Launch usage-based expansion tier",
      agent: "Finance Agent",
      uplift: "+₹61k MRR",
    },
    {
      id: "r2",
      title: "Reallocate 18% of paid spend to referral",
      agent: "Marketing Agent",
      uplift: "-24% CAC",
    },
    {
      id: "r3",
      title: "Automate onboarding stage 3 handoff",
      agent: "Operations Agent",
      uplift: "+9% activation",
    }
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading executive summary...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Summary"
        description="Board-ready narrative of the business — generated the way a chief of staff would write it."
        actions={
          <>
            <Button variant="outline" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button onClick={() => {
              window.print();
            }}>
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
            composite health score of 87 (+4). MRR reached <span className="font-semibold">₹482.9k</span> (+12.4%),
            driven by improving retention and a 24% reduction in acquisition cost via the referral
            channel. The primary opportunity is a usage-based expansion tier modeled at{" "}
            <span className="font-semibold">+₹61k MRR</span>. The main risk to watch is rising
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
            <SectionHeading title="Revenue performance" description="Actual vs forecast, ₹K" />
            <RevenueAreaChart data={revenueTrend} />
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.1}>
          <GlassCard className="h-full">
            <SectionHeading title="Key decisions" />
            <ul className="space-y-3">
              {decisions.map((d) => (
                <li key={d._id || d.id} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.outcome} · {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : d.date}</p>
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
                <li key={r._id || r.id} className="flex items-start gap-3 rounded-xl border border-border/50 p-3">
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
