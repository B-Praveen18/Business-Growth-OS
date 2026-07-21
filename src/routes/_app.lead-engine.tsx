import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, FadeIn, PageHeader } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Sparkles, Target, TrendingUp, Zap, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/lead-engine")({
  component: LeadEngine,
});

interface LeadResult {
  score: number;
  quality: "Hot" | "Warm" | "Cold";
  conversionProbability: number;
  expectedDealValue: string;
  nextBestActions: string[];
  reasons: string[];
}

const qualityMeta = {
  Hot:  { emoji: "🔥", color: "text-orange-500 bg-orange-500/10 border-orange-500/30" },
  Warm: { emoji: "🌤️", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30" },
  Cold: { emoji: "❄️", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
};

function ScoreArc({ value }: { value: number }) {
  const color = value >= 75 ? "#f97316" : value >= 45 ? "#eab308" : "#60a5fa";
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ * 0.75;
  return (
    <svg width="140" height="100" viewBox="0 0 140 100">
      <path d="M 14 90 A 56 56 0 1 1 126 90" fill="none" stroke="currentColor" strokeWidth="10" className="text-border" strokeLinecap="round" />
      <path d="M 14 90 A 56 56 0 1 1 126 90" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x="70" y="78" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" className="text-foreground">{value}</text>
      <text x="70" y="94" textAnchor="middle" fontSize="11" fill="currentColor" className="text-muted-foreground">/100</text>
    </svg>
  );
}

async function analyzeLead(form: { company: string; industry: string; budget: string; requirements: string }): Promise<LeadResult> {
  const prompt = `You are a B2B sales AI. Analyze this lead and respond ONLY with a valid JSON object, no markdown, no explanation.

Lead:
- Company: ${form.company}
- Industry: ${form.industry}
- Budget: ${form.budget}
- Requirements: ${form.requirements}

Return exactly this JSON shape:
{
  "score": <number 0-100>,
  "quality": <"Hot"|"Warm"|"Cold">,
  "conversionProbability": <number 0-100>,
  "expectedDealValue": "<string like ₹2.5 Lakhs or $12,000>",
  "nextBestActions": ["<action1>", "<action2>", "<action3>"],
  "reasons": ["<reason1>", "<reason2>", "<reason3>"]
}`;

  // Call via server-side proxy to avoid exposing key
  const res = await fetch("/api/lead-analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || "Analysis failed");
  }

  const data = await res.json() as { text: string };
  const cleaned = data.text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as LeadResult;
}

function LeadEngine() {
  const [form, setForm] = useState({ company: "", industry: "", budget: "", requirements: "" });
  const [result, setResult] = useState<LeadResult | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const analyze = async () => {
    if (!form.company || !form.industry || !form.budget) {
      toast.error("Fill in Company, Industry and Budget.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await analyzeLead(form);
      setResult(r);
    } catch (e: any) {
      toast.error(e.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const meta = result ? qualityMeta[result.quality] : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lead Intelligence Engine"
        description="Enter lead details and let AI score, qualify, and recommend the next best action."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Input form */}
        <FadeIn>
          <GlassCard className="space-y-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Lead Details
            </p>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={form.company} onChange={set("company")} placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={form.industry} onChange={set("industry")} placeholder="e.g. SaaS, Retail, Healthcare" />
            </div>
            <div className="space-y-2">
              <Label>Budget</Label>
              <Input value={form.budget} onChange={set("budget")} placeholder="e.g. ₹5 Lakhs, $10,000/yr" />
            </div>
            <div className="space-y-2">
              <Label>Requirements</Label>
              <textarea
                value={form.requirements}
                onChange={set("requirements")}
                placeholder="Describe what the lead is looking for…"
                className="min-h-[100px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <Button className="w-full" onClick={analyze} disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Analyze Lead</>
              )}
            </Button>
          </GlassCard>
        </FadeIn>

        {/* Result panel */}
        <FadeIn delay={0.05}>
          {!result && !loading && (
            <GlassCard className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </span>
              <p className="text-sm font-medium">AI Lead Analysis</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Fill in the lead details and click "Analyze Lead" to get an instant AI-powered score, quality rating, and action plan.
              </p>
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="flex h-full flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">AI is analyzing your lead…</p>
            </GlassCard>
          )}

          {result && meta && (
            <div className="space-y-4">
              {/* Score + quality */}
              <GlassCard glow className="flex items-center gap-6">
                <ScoreArc value={result.score} />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Lead Score</p>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold", meta.color)}>
                    {meta.emoji} {result.quality} Lead
                  </span>
                  <div className="flex gap-4 pt-1 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                      <p className="font-semibold text-success">{result.conversionProbability}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deal Value</p>
                      <p className="font-semibold">{result.expectedDealValue}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Next best actions */}
              <GlassCard>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Zap className="h-4 w-4 text-primary" /> Next Best Actions
                </p>
                <ul className="space-y-2">
                  {result.nextBestActions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Reasons */}
              <GlassCard>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-success" /> Why this score?
                </p>
                <ul className="space-y-2">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {r}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
