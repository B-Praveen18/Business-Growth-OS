import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatusPill,
} from "@/components/app/primitives";
import { roadmap } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/roadmap")({
  component: Roadmap,
});

const statusMeta = {
  done: { tone: "success" as const, label: "Complete", Icon: CheckCircle2 },
  active: { tone: "info" as const, label: "In progress", Icon: Clock },
  upcoming: { tone: "neutral" as const, label: "Upcoming", Icon: Circle },
};

function Roadmap() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Growth Roadmap"
        description="A living plan that adapts to your metrics and turns strategy into sequenced action."
        actions={
          <Button>
            <Plus className="h-4 w-4" /> Add initiative
          </Button>
        }
      />

      <div className="relative space-y-6 pl-6">
        <span className="absolute left-[7px] top-2 h-[calc(100%-2rem)] w-px bg-border" />
        {roadmap.map((phase, i) => {
          const meta = statusMeta[phase.status];
          return (
            <FadeIn key={phase.quarter} delay={i * 0.06}>
              <div className="relative">
                <span
                  className={cn(
                    "absolute -left-6 top-3 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-background",
                    phase.status === "done" && "bg-success",
                    phase.status === "active" && "bg-info",
                    phase.status === "upcoming" && "bg-muted-foreground",
                  )}
                />
                <GlassCard hover className={cn(phase.status === "active" && "shadow-glow border-primary/20")}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">{phase.quarter}</h3>
                        <StatusPill label={meta.label} tone={meta.tone} />
                      </div>
                      <p className="text-sm text-muted-foreground">{phase.theme}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{phase.items.length} initiatives</span>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {phase.items.map((item) => (
                      <li
                        key={item.title}
                        className="flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2.5 text-sm"
                      >
                        <meta.Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            phase.status === "done" ? "text-success" : "text-muted-foreground",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                        <span className="shrink-0 rounded-full bg-accent/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                          {item.owner}
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
