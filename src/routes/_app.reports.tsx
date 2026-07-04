import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatusPill,
} from "@/components/app/primitives";
import { reports } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { getReports, generateReport } from "@/lib/reports-api";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

function Reports() {
  const [reportsData, setReportsData] = useState<any[]>([]);

  const loadReports = async () => {
    try {
      const data = await getReports();
      const mapped = (data.reports || []).map((r: any) => ({
        id: r._id,
        title: r.title || r.reportType || "Report",
        period: r.period || "N/A",
        type: r.reportType || "General",
        status: r.status || "ready"
      }));
      setReportsData(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load reports");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Board-ready reports, generated on demand and on schedule."
        actions={
          <Button onClick={async () => {
            try {
              toast.info("Generating new report…");
              await generateReport({ reportType: "Executive Review" });
              toast.success("New report generated successfully!");
              await loadReports();
            } catch (err: any) {
              toast.error(err.message || "Failed to start report generation");
            }
          }}>
            <Plus className="h-4 w-4" /> New report
          </Button>
        }
      />

      <FadeIn>
        <SectionHeading title="Your reports" />
        <div className="grid gap-4 md:grid-cols-2">
          {reportsData.map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.04}>
              <GlassCard hover className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/60 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.type} · {r.period}
                  </p>
                </div>
                {r.status === "ready" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const content = `
========================================
           APEX GROWTH OS REPORT
========================================
Title:     ${r.title}
Type:      ${r.type}
Period:    ${r.period}
Status:    ${r.status}
Generated: ${new Date().toLocaleString()}
========================================

Summary:
This report was generated dynamically from metrics and KPI snapshots stored in your MongoDB database. All values are scoped by companyId tenant namespaces.

[Report details are simulated in this text export]
`;
                      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${r.title.replace(/\s+/g, "_")}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success(`Downloaded ${r.title}`);
                    }}
                  >
                    <Download className="h-4 w-4" /> Get
                  </Button>
                ) : (
                  <StatusPill label="Generating" tone="info" />
                )}
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <GlassCard className="bg-primary/5">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Clock className="h-4 w-4" /> Scheduled delivery
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your Executive Monthly Review is delivered to the board every first Monday at 8:00 AM.
          </p>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
