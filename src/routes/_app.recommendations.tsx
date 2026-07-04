import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
} from "@/components/app/primitives";
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
import { Sparkles, TrendingUp, Zap, ArrowRight, Check, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getSuggestions,
  addSuggestion,
  updateSuggestionStatus,
  type CompanySuggestion,
} from "@/lib/suggestions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/recommendations")({
  component: Recommendations,
});

const impactTone: Record<string, string> = {
  high: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  low: "bg-info/15 text-info",
};

const categoryFilters = ["All", "growth", "efficiency", "risk", "revenue", "operations"];

function Recommendations() {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<CompanySuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", description: "", category: "growth", impact: "", priority: "medium" });

  const user = getCurrentUser();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getSuggestions(user.email)
      .then(setSuggestions)
      .catch(() => toast.error("Failed to load suggestions."))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const list = suggestions.filter((s) => filter === "All" || s.category === filter);

  const handleAccept = async (s: CompanySuggestion) => {
    if (!s._id) return;
    try {
      const updated = await updateSuggestionStatus(s._id, "accepted");
      setSuggestions((prev) => prev.map((x) => (x._id === s._id ? updated : x)));
      toast.success("Added to your growth roadmap");
      setActive(null);
    } catch {
      toast.error("Failed to update suggestion.");
    }
  };

  const handleAdd = async () => {
    if (!user) { toast.error("Sign in first."); return; }
    if (!newForm.title || !newForm.description) { toast.error("Title and description are required."); return; }
    try {
      const created = await addSuggestion(user.email, {
        title: newForm.title,
        description: newForm.description,
        category: newForm.category as CompanySuggestion["category"],
        impact: newForm.impact,
        priority: newForm.priority as CompanySuggestion["priority"],
      });
      setSuggestions((prev) => [created, ...prev]);
      setNewForm({ title: "", description: "", category: "growth", impact: "", priority: "medium" });
      setAdding(false);
      toast.success("Suggestion saved to MongoDB");
    } catch {
      toast.error("Failed to save suggestion.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Recommendations"
        description="Prioritized, high-leverage actions modeled by your AI executive team."
        actions={
          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add suggestion
          </Button>
        }
      />

      <FadeIn>
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors capitalize",
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

      {loading && <p className="text-sm text-muted-foreground">Loading suggestions…</p>}

      {!loading && list.length === 0 && (
        <GlassCard className="py-12 text-center text-sm text-muted-foreground">
          No suggestions yet. Click "Add suggestion" to create one — it will be saved to MongoDB.
        </GlassCard>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((r, i) => (
          <FadeIn key={r._id ?? i} delay={i * 0.05}>
            <GlassCard hover className={cn("flex h-full flex-col gap-3", r.status === "accepted" && "border-success/30")}>
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-aurora text-background">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                <div className="flex items-center gap-2">
                  {r.status === "accepted" && (
                    <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Accepted</span>
                  )}
                  {r.priority && (
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", impactTone[r.priority])}>
                      {r.priority} priority
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                {r.impact && (
                  <span className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-3.5 w-3.5" /> {r.impact}
                  </span>
                )}
                <span className="flex items-center gap-1 capitalize">
                  <Zap className="h-3.5 w-3.5" /> {r.category}
                </span>
                <span className="ml-auto text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActive(r)}>
                Review <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          </FadeIn>
        ))}
      </div>

      {/* Review dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription className="capitalize">{active?.category}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{active?.description}</p>
          {active?.impact && (
            <div className="rounded-xl bg-accent/40 p-3 text-center">
              <p className="text-sm font-semibold">{active.impact}</p>
              <p className="text-xs text-muted-foreground">Expected impact</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActive(null)}>Dismiss</Button>
            <Button onClick={() => active && handleAccept(active)} disabled={active?.status === "accepted"}>
              <Check className="h-4 w-4" />
              {active?.status === "accepted" ? "Already accepted" : "Accept & plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add suggestion dialog */}
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New suggestion</DialogTitle>
            <DialogDescription>This will be saved to MongoDB under your account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={newForm.title} onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))} placeholder="Launch referral program" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <textarea
                value={newForm.description}
                onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the recommendation…"
                className="min-h-[80px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Category</Label>
                <select
                  value={newForm.category}
                  onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {["growth", "efficiency", "risk", "revenue", "operations"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Priority</Label>
                <select
                  value={newForm.priority}
                  onChange={(e) => setNewForm((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {["high", "medium", "low"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Expected impact (optional)</Label>
              <Input value={newForm.impact} onChange={(e) => setNewForm((p) => ({ ...p, impact: e.target.value }))} placeholder="+₹12k MRR" />
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
