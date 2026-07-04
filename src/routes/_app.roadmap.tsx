import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatusPill,
} from "@/components/app/primitives";
import { useState, useEffect } from "react";
import { getRoadmapItems, createRoadmapItem } from "@/lib/roadmap-api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/roadmap")({
  component: Roadmap,
});

const statusMeta = {
  done: { tone: "success" as const, label: "Complete", Icon: CheckCircle2 },
  active: { tone: "info" as const, label: "In progress", Icon: Clock },
  upcoming: { tone: "neutral" as const, label: "Upcoming", Icon: Circle },
};

function Roadmap() {
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    quarter: "Q3 2026",
    theme: "Expansion & Growth",
    priority: "medium" as "high" | "medium" | "low",
    status: "upcoming" as "done" | "active" | "upcoming",
    assignee: "Unassigned",
  });

  const loadRoadmap = async () => {
    try {
      const data = await getRoadmapItems();
      
      // Group items by quarter
      const grouped = (data.items || []).reduce((acc: any, item: any) => {
        if (!acc[item.quarter]) {
          acc[item.quarter] = { quarter: item.quarter, theme: item.theme || "Quarter Theme", status: item.status || "upcoming", items: [] };
        }
        acc[item.quarter].items.push({ title: item.title, owner: item.assignee || item.owner || "Unassigned" });
        return acc;
      }, {});
      
      setRoadmap(Object.values(grouped));
    } catch (err: any) {
      toast.error(err.message || "Failed to load roadmap");
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleAdd = async () => {
    if (!newForm.title) {
      toast.error("Title is required");
      return;
    }
    try {
      await createRoadmapItem(newForm);
      toast.success("Initiative added to roadmap!");
      setAdding(false);
      setNewForm({
        title: "",
        quarter: "Q3 2026",
        theme: "Expansion & Growth",
        priority: "medium",
        status: "upcoming",
        assignee: "Unassigned",
      });
      await loadRoadmap();
    } catch (err: any) {
      toast.error(err.message || "Failed to create roadmap item");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Growth Roadmap"
        description="A living plan that adapts to your metrics and turns strategy into sequenced action."
        actions={
          <Button onClick={() => setAdding(true)}>
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

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Initiative</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newForm.title}
                onChange={(e) => setNewForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Launch referral program"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="quarter">Quarter</Label>
                <Input
                  id="quarter"
                  value={newForm.quarter}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, quarter: e.target.value }))}
                  placeholder="e.g. Q3 2026"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={newForm.assignee}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, assignee: e.target.value }))}
                  placeholder="e.g. Marketing Agent"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={newForm.theme}
                onChange={(e) => setNewForm((prev) => ({ ...prev, theme: e.target.value }))}
                placeholder="e.g. Acquisition & Retention"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newForm.status}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={newForm.priority}
                  onChange={(e) => setNewForm((prev) => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save to MongoDB</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
