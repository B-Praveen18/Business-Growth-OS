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
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

function Reports() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Board-ready reports, generated on demand and on schedule."
        actions={
          <Button onClick={() => toast.success("Generating new report…")}>
            <Plus className="h-4 w-4" /> New report
          </Button>
        }
      />

      <FadeIn>
        <SectionHeading title="Your reports" />
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r, i) => (
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
                    onClick={() => toast.success(`Downloading ${r.title}`)}
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
