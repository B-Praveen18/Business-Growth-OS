import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/primitives";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import {
  Sparkles,
  Crown,
  Megaphone,
  TrendingUp,
  Wallet,
  Settings2,
  ShieldCheck,
  ArrowRight,
  HeartPulse,
  Swords,
  Map,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const agentPreviews = [
  { name: "CEO Agent", icon: Crown, desc: "Aligns strategy across every function." },
  { name: "Marketing Agent", icon: Megaphone, desc: "Optimizes demand, spend and brand." },
  { name: "Sales Agent", icon: TrendingUp, desc: "Finds and prioritizes revenue." },
  { name: "Finance Agent", icon: Wallet, desc: "Guards runway and models capital." },
  { name: "Operations Agent", icon: Settings2, desc: "Removes bottlenecks and scales delivery." },
];

const features = [
  { icon: HeartPulse, title: "Business Health Score", desc: "A single, trustworthy number that tells you how your company is really doing — updated continuously." },
  { icon: Sparkles, title: "AI Boardroom", desc: "Convene your AI executive team to debate decisions and reach consensus in seconds." },
  { icon: Swords, title: "Competitor Intelligence", desc: "Track rivals, positioning and market momentum without the manual research." },
  { icon: ShieldCheck, title: "Risk Radar", desc: "Surface threats before they become problems, ranked by probability and impact." },
  { icon: Map, title: "Growth Roadmap", desc: "A living plan that adapts to your metrics and turns strategy into sequenced action." },
  { icon: TrendingUp, title: "Executive Reporting", desc: "Board-ready summaries generated the way a chief of staff would write them." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-chart-5/10 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-aurora shadow-glow">
            <Sparkles className="h-4.5 w-4.5 text-background" />
          </span>
          <span className="text-lg font-semibold tracking-tight">BusinessOS</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#agents" className="hover:text-foreground">AI Agents</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-16 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            The AI Business Growth Operating System
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Don&apos;t let confusion cost your business.
            <br className="hidden md:block" />
            <span className="text-gradient">Better Call BusinessOS.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            BusinessOS turns scattered business data into calm, decisive clarity. Your AI
            executive team monitors health, uncovers growth, and helps you decide — every
            single morning.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/register">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">View live demo</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Hero image */}
      <motion.div
        className="relative z-10 mx-auto mt-16 max-w-6xl px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass overflow-hidden rounded-3xl p-2 shadow-elegant">
          <img
            src={heroDashboard}
            alt="BusinessOS dashboard preview showing business health score and revenue charts"
            width={1600}
            height={1104}
            className="rounded-2xl"
          />
        </div>
      </motion.div>

      {/* Logos / trust */}
      <section className="relative z-10 mx-auto mt-20 max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by operators building enduring companies
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-muted-foreground/60">
          <span>Northwind</span>
          <span>Meridian</span>
          <span>Lumen</span>
          <span>Cascade</span>
          <span>Vertex</span>
          <span>Halcyon</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Everything you need to <span className="text-gradient">grow with confidence</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            One calm surface for the metrics, decisions and intelligence that actually move
            your business.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <GlassCard hover className="h-full">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/60 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Meet your <span className="text-gradient">AI executive team</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Five specialized agents that think together — and answer to you.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {agentPreviews.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <GlassCard hover className="h-full text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-aurora text-background">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{a.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-28">
        <GlassCard className="p-10 text-center">
          <div className="mb-4 flex justify-center gap-1 text-warning">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-xl font-medium leading-relaxed md:text-2xl">
            "BusinessOS replaced three dashboards and a weekly ops meeting. I open it every
            morning and I finally feel like I'm ahead of my own company."
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Alex Rivera · Founder & CEO, Northwind Labs
          </p>
        </GlassCard>
      </section>

      {/* Pricing CTA */}
      <section id="pricing" className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-16 text-center">
          <div className="absolute inset-0 bg-gradient-glow" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Run your business like the future.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Start free today. No credit card required. Your AI board is ready when you are.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-aurora">
              <Sparkles className="h-3.5 w-3.5 text-background" />
            </span>
            <span className="font-medium text-foreground">BusinessOS</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


