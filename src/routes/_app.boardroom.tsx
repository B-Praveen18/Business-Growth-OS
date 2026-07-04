import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatusPill,
} from "@/components/app/primitives";
import { agents } from "@/lib/mock-data";
import { useEffect } from "react";
import { getChatHistory, sendChatMessage } from "@/lib/chat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Crown, Megaphone, TrendingUp, Wallet, Settings2, Sparkles, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/boardroom")({
  component: Boardroom,
});

const iconMap: Record<string, typeof Crown> = {
  ceo: Crown,
  marketing: Megaphone,
  sales: TrendingUp,
  finance: Wallet,
  operations: Settings2,
};

// transcript removed

function Boardroom() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChatHistory();
        if (data.session && data.session.messages) {
          setMessages(data.session.messages);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load chat history");
      }
    }
    load();
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    setInput("");
    
    // Add optimistic user message
    setMessages(prev => [...prev, { agent: "user", text: currentInput }]);
    
    try {
      const res = await sendChatMessage(currentInput);
      if (res.session && res.session.messages) {
        setMessages(res.session.messages);
      } else if (res.message) {
        setMessages(prev => [...prev, res.message]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Boardroom"
        description="Convene your AI executive team to debate a decision and reach consensus."
        actions={<StatusPill label="Session complete" tone="success" />}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_2.4fr]">
        {/* Participants */}
        <FadeIn>
          <GlassCard className="h-full">
            <SectionHeading title="Participants" />
            <ul className="space-y-2">
              {agents.map((a) => {
                const Icon = iconMap[a.id] ?? Sparkles;
                return (
                  <li key={a.id} className="flex items-center gap-3 rounded-xl border border-border/50 p-3">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                      style={{ background: `color-mix(in oklab, ${a.accent} 22%, transparent)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: a.accent }} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                    </div>
                    <span className={cn("ml-auto h-2 w-2 shrink-0 rounded-full", a.status === "idle" ? "bg-muted-foreground" : "bg-success")} />
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 rounded-xl bg-primary/5 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" /> Consensus reached
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Prioritize expansion revenue: launch usage-based tier, target 34 accounts,
                reallocate paid spend, automate onboarding.
              </p>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Transcript */}
        <FadeIn delay={0.05}>
          <GlassCard className="flex h-full flex-col">
            <SectionHeading title="Session transcript" description="Q3 Strategic Priorities" />
            <div className="flex-1 space-y-4">
              {messages.map((m, i) => {
                const agent = agents.find((a) => a.id === m.agent) || { name: m.agent === 'user' ? 'You' : 'Agent', accent: 'currentColor' };
                const Icon = iconMap[m.agent] ?? Sparkles;
                return (
                  <div key={i}>
                    <div className="flex gap-3">
                      <span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                        style={{ background: `color-mix(in oklab, ${agent.accent} 22%, transparent)` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: agent.accent }} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground">{agent.name}</p>
                        <div className="mt-1 rounded-2xl rounded-tl-sm bg-accent/40 px-4 py-2.5 text-sm leading-relaxed">
                          {m.text || m.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Pose a question to the board…"
              />
              <Button onClick={send} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}
