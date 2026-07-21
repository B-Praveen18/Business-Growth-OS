import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
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
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const agentPreviews = [
  { name: "CEO Agent",        icon: Crown,    desc: "Aligns strategy across every function." },
  { name: "Marketing Agent",  icon: Megaphone,desc: "Optimizes demand, spend and brand." },
  { name: "Sales Agent",      icon: TrendingUp,desc: "Finds and prioritizes revenue." },
  { name: "Finance Agent",    icon: Wallet,   desc: "Guards runway and models capital." },
  { name: "Operations Agent", icon: Settings2,desc: "Removes bottlenecks and scales delivery." },
];

const features = [
  { icon: HeartPulse, title: "Business Health Score",  desc: "A single, trustworthy number that tells you how your company is really doing — updated continuously." },
  { icon: Sparkles,   title: "AI Boardroom",           desc: "Convene your AI executive team to debate decisions and reach consensus in seconds." },
  { icon: Swords,     title: "Competitor Intelligence",desc: "Track rivals, positioning and market momentum without the manual research." },
  { icon: ShieldCheck,title: "Risk Radar",             desc: "Surface threats before they become problems, ranked by probability and impact." },
  { icon: Map,        title: "Growth Roadmap",         desc: "A living plan that adapts to your metrics and turns strategy into sequenced action." },
  { icon: TrendingUp, title: "Executive Reporting",    desc: "Board-ready summaries generated the way a chief of staff would write them." },
];

/* ── Rich Live Background Canvas ────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Grid ─────────────────────────────────────── */
    const GRID_SIZE = 60;

    /* ── Nodes ────────────────────────────────────── */
    const NODE_COUNT = 80;
    const PALETTES = [
      [138, 92, 255],   // violet
      [80,  180, 255],  // cyan
      [210, 90,  240],  // magenta
      [80,  220, 160],  // teal
    ];
    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const col = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        vx:    (Math.random() - 0.5) * 0.5,
        vy:    (Math.random() - 0.5) * 0.5,
        r:     Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.5,
        col,
        pulseT: Math.random() * Math.PI * 2,
      };
    });

    /* ── Shooting stars ───────────────────────────── */
    type Star = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; col: number[] };
    const stars: Star[] = [];
    const spawnStar = () => {
      const col = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.6),
        vx: (Math.random() * 6 + 4) * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.random() * 3 + 1,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        col,
      });
    };

    /* ── Orb rings ────────────────────────────────── */
    const ORB_RINGS = [
      { cx: 0.2, cy: 0.15, r: 200, col: [138, 92, 255], speed: 0.004 },
      { cx: 0.8, cy: 0.25, r: 160, col: [80,  180, 255], speed: 0.006 },
      { cx: 0.5, cy: 0.55, r: 240, col: [210, 90,  240], speed: 0.003 },
    ];
    let orbT = 0;

    const LINK_DIST = 160;
    let animId: number;
    let frameCount = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;
      orbT += 0.01;

      /* ── 1. GRID ─────────────────────────────── */
      const cols = Math.ceil(canvas.width  / GRID_SIZE) + 1;
      const rows = Math.ceil(canvas.height / GRID_SIZE) + 1;

      ctx.strokeStyle = "rgba(138, 92, 255, 0.18)";
      ctx.lineWidth   = 0.7;

      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let r = 0; r < rows; r++) {
        const y = r * GRID_SIZE;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Grid intersection dots
      ctx.fillStyle = "rgba(138, 92, 255, 0.30)";
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          ctx.arc(c * GRID_SIZE, r * GRID_SIZE, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ── 2. ORB RINGS ───────────────────────── */
      for (const orb of ORB_RINGS) {
        const cx = orb.cx * canvas.width;
        const cy = orb.cy * canvas.height;
        const pulse = Math.sin(orbT * orb.speed * 80) * 0.5 + 0.5;
        const [r, g, b] = orb.col;

        // Inner glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        grd.addColorStop(0,   `rgba(${r},${g},${b}, ${0.08 + pulse * 0.06})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b}, ${0.04 + pulse * 0.03})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b}, 0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Ring stroke
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r * 0.7 + pulse * 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b}, ${0.25 + pulse * 0.20})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r + pulse * 30, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b}, ${0.08 + pulse * 0.08})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      /* ── 3. NODES — update ──────────────────── */
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.pulseT += 0.04;
      }

      /* ── 4. LINKS ───────────────────────────── */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const t = 1 - dist / LINK_DIST;
            const [r, g, b] = nodes[i].col;
            // Gradient line
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            const [r2, g2, b2] = nodes[j].col;
            grad.addColorStop(0, `rgba(${r},${g},${b}, ${t * 0.45})`);
            grad.addColorStop(1, `rgba(${r2},${g2},${b2}, ${t * 0.25})`);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = t * 1.4;
            ctx.stroke();
          }
        }
      }

      /* ── 5. NODE DOTS + halo ────────────────── */
      for (const n of nodes) {
        const [r, g, b] = n.col;
        const pulse = (Math.sin(n.pulseT) * 0.5 + 0.5);
        const haloR = n.r * 4 + pulse * 6;

        // Halo glow
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
        halo.addColorStop(0,   `rgba(${r},${g},${b}, ${0.30 + pulse * 0.15})`);
        halo.addColorStop(0.5, `rgba(${r},${g},${b}, ${0.08 + pulse * 0.06})`);
        halo.addColorStop(1,   `rgba(${r},${g},${b}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b}, ${n.alpha})`;
        ctx.fill();
      }

      /* ── 6. SHOOTING STARS ──────────────────── */
      if (frameCount % 90 === 0 && stars.length < 6) spawnStar();

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        const progress = s.life / s.maxLife;
        const fade     = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
        const tailLen  = 80 + s.vx * 4;
        const [r, g, b] = s.col;

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - (s.vx / Math.abs(s.vx)) * tailLen,
          s.y - s.vy * (tailLen / Math.abs(s.vx)),
        );
        grad.addColorStop(0,   `rgba(${r},${g},${b}, ${fade * 0.9})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b}, ${fade * 0.35})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b}, 0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - (s.vx / Math.abs(s.vx)) * tailLen,
          s.y - s.vy * (tailLen / Math.abs(s.vx)),
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 2.5 * fade;
        ctx.stroke();

        // Head glow
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        headGlow.addColorStop(0, `rgba(255,255,255, ${fade * 0.9})`);
        headGlow.addColorStop(0.3, `rgba(${r},${g},${b}, ${fade * 0.6})`);
        headGlow.addColorStop(1, `rgba(${r},${g},${b}, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        if (s.life >= s.maxLife) stars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
}

/* ── Landing Page ────────────────────────────────────────── */
function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">

      {/* ── LIVE BACKGROUND LAYER ── */}
      <ParticleCanvas />

      {/* ── Deep aurora blobs (behind canvas, add colour depth) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        {/* Violet — top-center */}
        <div className="animate-aurora animate-glow-breathe absolute -top-60 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 1000, height: 700,
            background: "radial-gradient(ellipse, rgba(138,92,255,0.28) 0%, transparent 65%)",
            filter: "blur(80px)" }}
        />
        {/* Cyan — top-right */}
        <div className="animate-aurora-2 animate-glow-breathe absolute -right-40 -top-20 rounded-full"
          style={{ width: 600, height: 600, animationDelay: "-6s",
            background: "radial-gradient(circle, rgba(80,180,255,0.22) 0%, transparent 65%)",
            filter: "blur(70px)" }}
        />
        {/* Magenta — left-mid */}
        <div className="animate-aurora-3 animate-glow-breathe absolute -left-32 top-1/3 rounded-full"
          style={{ width: 520, height: 520, animationDelay: "-11s",
            background: "radial-gradient(circle, rgba(210,90,240,0.18) 0%, transparent 65%)",
            filter: "blur(65px)" }}
        />
        {/* Teal — bottom */}
        <div className="animate-aurora animate-glow-breathe absolute -bottom-40 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 800, height: 500, animationDelay: "-9s",
            background: "radial-gradient(ellipse, rgba(80,220,160,0.14) 0%, transparent 65%)",
            filter: "blur(80px)" }}
        />

        {/* Bright scan-line */}
        <div className="animate-scan-line absolute left-0 right-0 h-[2px]"
          style={{ top: 0,
            background: "linear-gradient(90deg, transparent, rgba(138,92,255,0.6), rgba(80,180,255,0.5), rgba(138,92,255,0.6), transparent)" }}
        />
      </div>

      {/* Edge vignette so content stays readable */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 2,
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,8,20,0.65) 100%)" }}
      />

      {/* ─────────────── Page Content ─────────────── */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── Nav ── */}
        <header
          className="sticky top-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          style={{
            background: "oklch(0.10 0.018 265 / 0.70)",
            backdropFilter: "blur(28px) saturate(160%)",
            borderBottom: "1px solid oklch(0.28 0.022 265 / 0.4)",
            boxShadow: "0 1px 0 oklch(0.72 0.20 280 / 0.08)",
          }}
        >
          {/* Top edge glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.5), oklch(0.72 0.17 215 / 0.4), transparent)" }}
          />

          <div className="flex items-center gap-3">
            {/* Logo with orbit */}
            <div className="relative">
              <div
                className="animate-orbit absolute -inset-1.5 rounded-xl"
                style={{
                  background: "conic-gradient(from 0deg, oklch(0.72 0.20 280 / 0.9), oklch(0.70 0.18 330 / 0.5), oklch(0.72 0.17 215 / 0.7), oklch(0.72 0.20 280 / 0.9))",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1.5px",
                  borderRadius: "13px",
                }}
              />
              <span
                className="relative grid h-9 w-9 place-items-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                  boxShadow: "0 0 16px oklch(0.72 0.20 280 / 0.5)",
                }}
              >
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </span>
            </div>
            <span
              className="text-lg font-bold tracking-tight animate-neon-flicker"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BusinessOS
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {["Features", "AI Agents", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="transition-colors hover:text-foreground"
                onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = "oklch(0.72 0.20 280)"; }}
                onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = ""; }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
            <Button asChild>
              <Link to="/register" style={{
                background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                boxShadow: "0 0 20px oklch(0.72 0.20 280 / 0.35)",
              }}>
                Get started
              </Link>
            </Button>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="mx-auto max-w-4xl px-6 pt-20 text-center md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                background: "oklch(0.72 0.20 280 / 0.12)",
                border: "1px solid oklch(0.72 0.20 280 / 0.35)",
                color: "oklch(0.72 0.20 280)",
                boxShadow: "0 0 20px oklch(0.72 0.20 280 / 0.12)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-dot-pulse" style={{ background: "oklch(0.74 0.17 155)" }} />
              The AI Business Growth Operating System
              <Zap className="h-3 w-3" />
            </span>

            {/* Headline */}
            <h1 className="mt-7 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-foreground">Don&apos;t let confusion cost</span>
              <br className="hidden md:block" />
              <span className="text-foreground"> your business.</span>
              <br />
              <span style={{
                background: "linear-gradient(135deg, oklch(0.72 0.20 280) 0%, oklch(0.72 0.17 215) 50%, oklch(0.76 0.17 155) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Better Call BusinessOS.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              BusinessOS turns scattered business data into calm, decisive clarity. Your AI
              executive team monitors health, uncovers growth, and helps you decide — every
              single morning.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link
                  to="/register"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                    boxShadow: "0 0 30px oklch(0.72 0.20 280 / 0.40), 0 4px 16px oklch(0 0 0 / 0.4)",
                    border: "none",
                    fontWeight: 700,
                  }}
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <Link
                  to="/dashboard"
                  style={{
                    background: "oklch(0.16 0.020 265 / 0.6)",
                    border: "1px solid oklch(0.72 0.20 280 / 0.35)",
                    color: "oklch(0.72 0.20 280)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  View live demo
                </Link>
              </Button>
            </div>

            {/* Live stats strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { label: "Uptime", value: "99.9%" },
                { label: "Avg health score lift", value: "+24 pts" },
                { label: "Decisions automated", value: "12k+" },
                { label: "Revenue uncovered", value: "₹4.2Cr+" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: "oklch(0.72 0.20 280)" }}>{s.value}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Hero image ── */}
        <motion.div
          className="relative mx-auto mt-16 max-w-6xl px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="overflow-hidden rounded-3xl p-2"
            style={{
              background: "oklch(0.16 0.022 265 / 0.9)",
              border: "1px solid oklch(0.72 0.20 280 / 0.25)",
              boxShadow: "0 0 0 1px oklch(0.72 0.20 280 / 0.08) inset, 0 40px 80px -20px oklch(0 0 0 / 0.7), 0 0 80px oklch(0.72 0.20 280 / 0.10)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Top gradient edge */}
            <div
              className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.6), oklch(0.72 0.17 215 / 0.5), transparent)" }}
            />
            <img
              src={heroDashboard}
              alt="BusinessOS dashboard preview"
              width={1600}
              height={1104}
              className="rounded-2xl"
            />
          </div>
          {/* Bottom glow under image */}
          <div
            className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 600, height: 120,
              background: "radial-gradient(ellipse, oklch(0.72 0.20 280 / 0.20) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </motion.div>

        {/* ── Trusted by strip ── */}
        <section className="mx-auto mt-24 max-w-5xl px-6 text-center">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">
            Trusted by operators building enduring companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["Northwind", "Meridian", "Lumen", "Cascade", "Vertex", "Halcyon"].map((brand) => (
              <span
                key={brand}
                className="text-lg font-bold transition-all duration-300 hover:scale-105"
                style={{ color: "oklch(0.72 0.20 280 / 0.35)" }}
                onMouseEnter={(e) => { (e.target as HTMLSpanElement).style.color = "oklch(0.72 0.20 280 / 0.85)"; }}
                onMouseLeave={(e) => { (e.target as HTMLSpanElement).style.color = "oklch(0.72 0.20 280 / 0.35)"; }}
              >
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-28">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to{" "}
              <span style={{
                background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.72 0.17 215), oklch(0.76 0.17 155))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                grow with confidence
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              One calm surface for the metrics, decisions and intelligence that actually move your business.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <GlassCard hover className="h-full">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.72 0.20 280 / 0.18), oklch(0.70 0.18 330 / 0.12))",
                      border: "1px solid oklch(0.72 0.20 280 / 0.28)",
                      color: "oklch(0.72 0.20 280)",
                      boxShadow: "0 0 16px oklch(0.72 0.20 280 / 0.14)",
                    }}
                  >
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Agents ── */}
        <section id="ai-agents" className="mx-auto max-w-7xl px-6 pb-28">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Meet your{" "}
              <span style={{
                background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.72 0.17 215))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                AI executive team
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Five specialized agents that think together — and answer to you.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {agentPreviews.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <GlassCard hover className="h-full text-center">
                  <span
                    className="mx-auto grid h-12 w-12 place-items-center rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                      boxShadow: "0 0 20px oklch(0.72 0.20 280 / 0.4)",
                      color: "white",
                    }}
                  >
                    <a.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{a.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Testimonial ── */}
        <section className="mx-auto max-w-4xl px-6 pb-28">
          <GlassCard className="p-10 text-center" glow>
            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" style={{ color: "oklch(0.80 0.16 75)" }} />
              ))}
            </div>
            <p className="text-xl font-semibold leading-relaxed md:text-2xl">
              "BusinessOS replaced three dashboards and a weekly ops meeting. I open it every
              morning and I finally feel like I'm ahead of my own company."
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.20 330))" }}
              >
                AR
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold">Alex Rivera</p>
                <p className="text-xs text-muted-foreground">Founder & CEO, Northwind Labs</p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ── Pricing CTA ── */}
        <section id="pricing" className="mx-auto max-w-5xl px-6 pb-28">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 text-center"
            style={{
              background: "linear-gradient(135deg, oklch(0.16 0.022 265 / 0.9), oklch(0.12 0.018 265 / 0.8))",
              border: "1px solid oklch(0.72 0.20 280 / 0.30)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 60px oklch(0.72 0.20 280 / 0.12), 0 40px 80px -20px oklch(0 0 0 / 0.6)",
            }}
          >
            {/* Card top glow */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.7), oklch(0.72 0.17 215 / 0.6), transparent)" }}
            />
            {/* Background radial glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% -20%, oklch(0.72 0.20 280 / 0.15), transparent 60%)" }}
            />
            <div className="relative">
              <span
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "oklch(0.72 0.20 280 / 0.15)", border: "1px solid oklch(0.72 0.20 280 / 0.35)", color: "oklch(0.72 0.20 280)" }}
              >
                <Zap className="h-3 w-3" /> Free forever plan available
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Run your business like the future.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Start free today. No credit card required. Your AI board is ready when you are.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/register" style={{
                    background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                    boxShadow: "0 0 30px oklch(0.72 0.20 280 / 0.45)",
                    border: "none",
                    fontWeight: 700,
                  }}>
                    Get started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login" style={{
                    background: "oklch(0.16 0.020 265 / 0.5)",
                    border: "1px solid oklch(0.72 0.20 280 / 0.30)",
                    color: "oklch(0.72 0.20 280)",
                  }}>
                    Sign in
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid oklch(0.28 0.022 265 / 0.5)",
            background: "oklch(0.10 0.018 265 / 0.85)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-7 w-7 place-items-center rounded-lg"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))" }}
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="font-semibold text-foreground">BusinessOS</span>
              <span>© 2026</span>
            </div>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Security"].map((link) => (
                <a key={link} href="#" className="transition-colors hover:text-foreground">{link}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
