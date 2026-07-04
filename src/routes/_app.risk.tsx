import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  MiniProgress,
  StatCard,
} from "@/components/app/primitives";
import { useState, useEffect } from "react";
import { getRisks } from "@/lib/risks-api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, AlertTriangle, Activity, Download } from "lucide-react";

export const Route = createFileRoute("/_app/risk")({
  component: RiskAnalysis,
});

const severityTone: Record<string, string> = {
  critical: "text-destructive bg-destructive/15",
  high: "text-destructive bg-destructive/10",
  medium: "text-warning bg-warning/15",
  low: "text-info bg-info/15",
};

function RiskAnalysis() {
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRisks();
        setRisks(data.risks || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load risks");
      }
    }
    load();
  }, []);

  const exportRisks = () => {
    if (!risks || risks.length === 0) {
      toast.error("No risks data to export.");
      return;
    }
    const headers = ["Title", "Severity", "Probability", "Category", "Owner", "Mitigation", "Status"];
    const rows = risks.map((r: any) => [
      `"${r.title.replace(/"/g, '""')}"`,
      r.severity,
      `${r.probability}%`,
      r.category || "",
      r.owner || "",
      `"${(r.mitigation || "").replace(/"/g, '""')}"`,
      r.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "risk_register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  const activeRisks = risks.length;
  const highSeverity = risks.filter(r => r.severity === 'high' || r.severity === 'critical').length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Risk Analysis"
        description="Surface threats before they become problems — ranked by probability and impact."
        actions={
          <Button variant="outline" onClick={exportRisks}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Overall risk level" value="Moderate" icon={ShieldAlert} />
          <StatCard label="Active risks" value={activeRisks.toString()} icon={AlertTriangle} />
          <StatCard label="High severity" value={highSeverity.toString()} icon={ShieldAlert} />
          <StatCard label="Mitigated (30d)" value="6" delta="+2" trend="up" icon={ShieldCheck} />
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <SectionHeading title="Risk register" description="Ordered by severity and likelihood" />
        <div className="space-y-4">
          {risks.map((r) => (
            <GlassCard key={r.id} hover className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex items-start gap-4">
                <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", severityTone[r.severity])}>
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{r.title}</p>
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", severityTone[r.severity])}>
                      {r.severity}
                    </span>
                    <span className="rounded-full bg-accent/60 px-2 py-0.5 text-[11px] text-muted-foreground">{r.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                </div>
              </div>
              <div className="w-full sm:w-44">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Probability</span>
                  <span className="font-medium text-foreground">{r.probability}%</span>
                </div>
                <MiniProgress value={r.probability} className="mt-1.5" />
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  View mitigation
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <GlassCard className="bg-primary/5">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Activity className="h-4 w-4" /> AI mitigation summary
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your highest-priority action is addressing mid-market churn: deploy a proactive
            success play to the 11 flagged accounts within 14 days. Secondary: introduce
            multi-region infrastructure redundancy in Q4 to reduce single-vendor exposure.
          </p>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
