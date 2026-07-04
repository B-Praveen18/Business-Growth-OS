import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  ScoreRing,
  StatusPill,
  EmptyState,
} from "@/components/app/primitives";
import { MiniAreaChart } from "@/components/app/charts";
import { agents, revenueTrend } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Crown, Megaphone, TrendingUp, Wallet, Settings2, Sparkles, Send, ListChecks, Bot } from "lucide-react";

export const Route = createFileRoute("/_app/agents/$agentId")({
  component: AgentDetail,
});

const iconMap: Record<string, typeof Crown> = {
  ceo: Crown,
  marketing: Megaphone,
  sales: TrendingUp,
  finance: Wallet,
  operations: Settings2,
};

const focusMap: Record<string, { metrics: { label: string; value: string }[]; tasks: string[] }> = {
  ceo: {
    metrics: [
      { label: "Strategic alignment", value: "94%" },
      { label: "Decisions this month", value: "12" },
      { label: "Cross-team initiatives", value: "8" },
    ],
    tasks: ["Ratify Q3 priorities", "Review board narrative", "Align expansion strategy", "Approve roadmap changes"],
  },
  marketing: {
    metrics: [
      { label: "Blended CAC", value: "$212" },
      { label: "Pipeline generated", value: "$1.2M" },
      { label: "Best channel", value: "Referral" },
    ],
    tasks: ["Reallocate paid spend", "Relaunch referral program", "Refresh positioning", "A/B test onboarding emails"],
  },
  sales: {
    metrics: [
      { label: "Pipeline value", value: "$2.4M" },
      { label: "Win rate", value: "28%" },
      { label: "Expansion accounts", value: "34" },
    ],
    tasks: ["Prioritize 34 expansion accounts", "Update forecast", "Coach on discovery", "Flag at-risk deals"],
  },
  finance: {
    metrics: [
      { label: "Runway", value: "22 mo" },
      { label: "Burn multiple", value: "1.2x" },
      { label: "Gross margin", value: "78%" },
    ],
    tasks: ["Model usage-based tier", "Refresh runway forecast", "Review vendor spend", "Prep board financials"],
  },
  operations: {
    metrics: [
      { label: "Activation rate", value: "41%" },
      { label: "Time to value", value: "6.4 days" },
      { label: "Uptime", value: "99.98%" },
    ],
    tasks: ["Automate onboarding handoff", "Reduce activation time", "Audit infra redundancy", "Streamline support"],
  },
};

function AgentDetail() {
  const { agentId } = Route.useParams();
  const agent = agents.find((a) => a.id === agentId);
  const [input, setInput] = useState("");

  if (!agent) {
    return (
      <EmptyState
        icon={Bot}
        title="Agent not found"
        description="We couldn't find that agent. Return to your dashboard to see your AI team."
        action={
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        }
      />
    );
  }

  const Icon = iconMap[agent.id] ?? Sparkles;
  const focus = focusMap[agent.id];

  const send = () => {
    if (!input.trim()) return;
    toast.info("Connect an AI provider to chat with this agent live.");
    setInput("");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={agent.name}
        description={agent.role}
        actions={
          <StatusPill
            label={agent.status}
            tone={agent.status === "active" ? "success" : agent.status === "analyzing" ? "info" : "neutral"}
          />
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <FadeIn>
          <GlassCard glow className="flex h-full flex-col items-center gap-4 py-8 text-center">
            <span
              className="grid h-16 w-16 place-items-center rounded-2xl"
              style={{ background: `color-mix(in oklab, ${agent.accent} 22%, transparent)` }}
            >
              <Icon className="h-7 w-7" style={{ color: agent.accent }} />
            </span>
            <ScoreRing value={agent.confidence} size={132} label="confidence" />
            <p className="max-w-xs text-sm text-muted-foreground">{agent.summary}</p>
            <div className="flex gap-2">
              <span className="rounded-full bg-accent/50 px-3 py-1 text-xs">{agent.tasks} active tasks</span>
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid h-full gap-5">
            <GlassCard>
              <SectionHeading title="Key metrics" />
              <div className="grid grid-cols-3 gap-3">
                {focus.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/50 p-4 text-center">
                    <p className="text-xl font-semibold">{m.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <MiniAreaChart data={revenueTrend} color={agent.accent} />
              </div>
            </GlassCard>

            <GlassCard>
              <SectionHeading title="Current focus" />
              <ul className="space-y-2">
                {focus.tasks.map((t, i) => (
                  <li key={t} className="flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2.5 text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent/60 text-xs font-medium">{i + 1}</span>
                    {t}
                    <ListChecks className={cn("ml-auto h-4 w-4", i === 0 ? "text-success" : "text-muted-foreground")} />
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.1}>
        <GlassCard>
          <SectionHeading title={`Ask ${agent.name}`} description="Get a focused perspective from this agent" />
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`e.g. What should ${agent.name.split(" ")[0]} prioritize this week?`}
            />
            <Button onClick={send} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
