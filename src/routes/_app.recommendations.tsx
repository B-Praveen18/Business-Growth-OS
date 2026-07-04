import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
} from "@/components/app/primitives";
import { recommendations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Zap, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/_app/recommendations")({
  component: Recommendations,
});

const impactTone: Record<string, string> = {
  High: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-info/15 text-info",
};

const filters = ["All", "Growth", "Pricing", "Sales", "Efficiency"];

function Recommendations() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<(typeof recommendations)[number] | null>(null);

  const list = recommendations.filter((r) => filter === "All" || r.category === filter);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Recommendations"
        description="Prioritized, high-leverage actions modeled by your AI executive team."
      />

      <FadeIn>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                filter === f
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-accent/50",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((r, i) => (
          <FadeIn key={r.id} delay={i * 0.05}>
            <GlassCard hover className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-aurora text-background">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", impactTone[r.impact])}>
                  {r.impact} impact
                </span>
              </div>
              <div>
                <p className="text-base font-semibold">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-3.5 w-3.5" /> {r.uplift}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> {r.effort} effort
                </span>
                <span className="ml-auto">{r.agent}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActive(r)}>
                Review <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          </FadeIn>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription>
              {active?.agent} · {active?.category}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{active?.description}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Impact", v: active?.impact },
              { l: "Effort", v: active?.effort },
              { l: "Modeled uplift", v: active?.uplift },
            ].map((x) => (
              <div key={x.l} className="rounded-xl bg-accent/40 p-3 text-center">
                <p className="text-sm font-semibold">{x.v}</p>
                <p className="text-xs text-muted-foreground">{x.l}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActive(null)}>
              Dismiss
            </Button>
            <Button
              onClick={() => {
                toast.success("Added to your growth roadmap");
                setActive(null);
              }}
            >
              <Check className="h-4 w-4" /> Accept & plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
