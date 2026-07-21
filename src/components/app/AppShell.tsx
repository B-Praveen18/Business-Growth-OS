import { type ReactNode, useEffect, useRef } from "react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette, useCommandPalette } from "./CommandPalette";

/* ── Particle Canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const PRIMARY  = "127, 102, 255";  // violet
    const CYAN     = "92,  180, 240";  // cyan
    const PINK     = "200, 100, 220";  // pink

    const palettes = [PRIMARY, CYAN, PINK];
    const colors   = particles.map(() => palettes[Math.floor(Math.random() * palettes.length)]);

    let animId: number;
    const LINK_DIST = 140;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      // Draw links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const opacity = (1 - dist / LINK_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${colors[i]}, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors[i]}, ${p.alpha})`;
        ctx.fill();
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
      style={{ zIndex: 0, opacity: 0.6 }}
    />
  );
}

/* ── App Shell ───────────────────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open, setOpen } = useCommandPalette();

  return (
    <div className="relative flex min-h-screen w-full bg-background">

      {/* ── Live Particle Canvas ── */}
      <ParticleCanvas />

      {/* ── Particle dot-grid overlay ── */}
      <div className="particle-grid pointer-events-none fixed inset-0 opacity-30" style={{ zIndex: 1 }} />

      {/* ── 5-orb animated aurora system ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        {/* Orb 1 — Violet top-left */}
        <div
          className="animate-aurora absolute -left-60 -top-60 rounded-full animate-glow-breathe"
          style={{
            width: 600, height: 600,
            background: "radial-gradient(circle, oklch(0.72 0.20 280 / 0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Orb 2 — Cyan top-right */}
        <div
          className="animate-aurora-2 absolute -right-40 -top-20 rounded-full animate-glow-breathe"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, oklch(0.72 0.17 215 / 0.14) 0%, transparent 70%)",
            filter: "blur(50px)",
            animationDelay: "-6s",
          }}
        />
        {/* Orb 3 — Pink bottom-right */}
        <div
          className="animate-aurora-3 absolute -bottom-40 right-1/4 rounded-full animate-glow-breathe"
          style={{
            width: 480, height: 480,
            background: "radial-gradient(circle, oklch(0.70 0.20 330 / 0.12) 0%, transparent 70%)",
            filter: "blur(45px)",
            animationDelay: "-12s",
          }}
        />
        {/* Orb 4 — Teal bottom-left */}
        <div
          className="animate-aurora absolute bottom-0 -left-20 rounded-full animate-glow-breathe"
          style={{
            width: 400, height: 400,
            background: "radial-gradient(circle, oklch(0.76 0.17 155 / 0.10) 0%, transparent 70%)",
            filter: "blur(55px)",
            animationDelay: "-4s",
          }}
        />
        {/* Orb 5 — Center subtle */}
        <div
          className="animate-float absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 800, height: 800,
            background: "radial-gradient(circle, oklch(0.72 0.20 280 / 0.04) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        {/* ── Scan-line ── */}
        <div
          className="animate-scan-line absolute left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.25), oklch(0.72 0.17 215 / 0.20), transparent)",
            top: 0,
          }}
        />
      </div>

      {/* ── Sidebar ── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <div className="relative flex min-w-0 flex-1 flex-col" style={{ zIndex: 5 }}>
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  );
}
