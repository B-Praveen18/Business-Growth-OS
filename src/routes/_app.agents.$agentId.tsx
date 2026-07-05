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
import { agents } from "@/lib/mock-data";
import { useEffect } from "react";
import { getMetrics } from "@/lib/metrics-api";
import { getChatHistory, sendChatMessage } from "@/lib/chat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Crown, Megaphone, TrendingUp, Wallet, Settings2, Sparkles, Send, ListChecks, Bot, Loader2 } from "lucide-react";

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
      { label: "Blended CAC", value: "₹212" },
      { label: "Pipeline generated", value: "₹1.2M" },
      { label: "Best channel", value: "Referral" },
    ],
    tasks: ["Reallocate paid spend", "Relaunch referral program", "Refresh positioning", "A/B test onboarding emails"],
  },
  sales: {
    metrics: [
      { label: "Pipeline value", value: "₹2.4M" },
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
  const [metrics, setMetrics] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getMetrics().then(res => setMetrics(res.metrics || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!agentId) return;
    setMessages([]);
    getChatHistory(agentId)
      .then((data: any) => setMessages(data?.session?.messages || []))
      .catch((err: any) => toast.error(err.message || "Failed to load chat history"));
  }, [agentId]);

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

  const send = async () => {
    if (!input.trim() || sending) return;
    const currentInput = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: currentInput, timestamp: new Date().toISOString() }]);
    setSending(true);
    try {
      const res: any = await sendChatMessage(currentInput, agentId);
      if (res?.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
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

          {messages.length > 0 && (
            <div className="mb-4 max-h-80 space-y-3 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-accent/40 rounded-tl-sm"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-accent/40 px-4 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> {agent.name} is thinking…
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`e.g. What should ${agent.name.split(" ")[0]} prioritize this week?`}
              disabled={sending}
            />
            <Button onClick={send} size="icon" disabled={sending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
