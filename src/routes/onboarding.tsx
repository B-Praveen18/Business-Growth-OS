import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getCurrentUser, updateUser } from "@/lib/auth";
import {
  Sparkles,
  Building2,
  Target,
  Plug,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const steps = [
  { title: "Company", icon: Building2 },
  { title: "Focus", icon: Target },
  { title: "Connect", icon: Plug },
  { title: "Ready", icon: Rocket },
];

const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Growth", "Public"];
const industries = ["SaaS", "Fintech", "E-commerce", "Healthcare", "Marketplace", "AI / ML"];
const goals = [
  { icon: TrendingUp, label: "Grow revenue" },
  { icon: Users, label: "Reduce churn" },
  { icon: DollarSign, label: "Extend runway" },
  { icon: Target, label: "Win market share" },
];
const integrations = ["Stripe", "HubSpot", "QuickBooks", "Google Analytics", "Salesforce", "Slack"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [stage, setStage] = useState("Series A");
  const [industry, setIndustry] = useState("SaaS");
  const [picked, setPicked] = useState<string[]>(["Grow revenue"]);
  const [connected, setConnected] = useState<string[]>(["Stripe", "Google Analytics"]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const next = async () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      const user = getCurrentUser();
      if (user) {
        try {
          await updateUser({
            ...user,
            company: companyName || user.company,
            industry,
            businessDescription: `Stage: ${stage}. Goals: ${picked.join(", ")}. Integrations: ${connected.join(", ")}. Website: ${website}`,
          });
        } catch {
          // non-blocking — proceed to dashboard even if update fails
        }
      }
      toast.success("Your workspace is ready");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-aurora shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-background" />
          </span>
          <span className="text-lg font-semibold tracking-tight">BusinessOS</span>
        </Link>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                  i === step
                    ? "bg-accent text-foreground"
                    : i < step
                      ? "text-success"
                      : "text-muted-foreground",
                )}
              >
                {i < step ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <span className={cn("mx-1 h-px w-6", i < step ? "bg-success" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-6 shadow-elegant sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold">Tell us about your company</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This helps your AI board calibrate its recommendations.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cname">Company name</Label>
                    <Input id="cname" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Northwind Labs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">Website</Label>
                    <Input id="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="northwind.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company stage</Label>
                    <div className="flex flex-wrap gap-2">
                      {stages.map((s) => (
                        <Chip key={s} active={stage === s} onClick={() => setStage(s)}>
                          {s}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold">What matters most right now?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pick your industry and top priorities.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((s) => (
                        <Chip key={s} active={industry === s} onClick={() => setIndustry(s)}>
                          {s}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary goals</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {goals.map((g) => {
                        const on = picked.includes(g.label);
                        return (
                          <button
                            key={g.label}
                            onClick={() => toggle(picked, setPicked, g.label)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                              on
                                ? "border-primary/50 bg-primary/10"
                                : "border-border/60 hover:bg-accent/50",
                            )}
                          >
                            <g.icon className={cn("h-4 w-4", on ? "text-primary" : "text-muted-foreground")} />
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold">Connect your data sources</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      BusinessOS gets smarter with every connection. You can add more later.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {integrations.map((it) => {
                      const on = connected.includes(it);
                      return (
                        <button
                          key={it}
                          onClick={() => toggle(connected, setConnected, it)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",
                            on ? "border-primary/50 bg-primary/10" : "border-border/60 hover:bg-accent/50",
                          )}
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/60 text-xs font-semibold">
                            {it.slice(0, 2)}
                          </span>
                          {it}
                          {on && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-aurora text-background shadow-glow">
                    <Rocket className="h-8 w-8" />
                  </span>
                  <h2 className="text-2xl font-semibold">Your growth OS is ready</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    We've configured {industry} benchmarks for a {stage} company and connected{" "}
                    {connected.length} data sources. Your AI board is standing by.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <span className="text-xs text-muted-foreground">
              Step {step + 1} of {steps.length}
            </span>
            <Button onClick={next}>
              {step === steps.length - 1 ? "Enter BusinessOS" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active ? "border-primary/50 bg-primary/10 text-foreground" : "border-border/60 text-muted-foreground hover:bg-accent/50",
      )}
    >
      {children}
    </button>
  );
}


