import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

/* ============================================================
   GLASS CARD
   ============================================================ */
export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-card card-edge rounded-2xl p-5 shadow-md transition-all duration-300",
        hover && "hover:-translate-y-1 cursor-pointer",
        glow && "shadow-glow",
        className,
      )}
      style={hover ? {
        ["--hover-shadow" as any]: "var(--shadow-card-hover)",
      } : undefined}
      onMouseEnter={hover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px -12px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(0.72 0.20 280 / 0.22)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.20 280 / 0.22)";
      } : undefined}
      onMouseLeave={hover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.borderColor = "";
      } : undefined}
    >
      {children}
    </div>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
export function StatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <GlassCard hover className={cn("flex flex-col gap-3 relative overflow-hidden", className)}>
      {/* Top-edge gradient line already added by .card-edge */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.20 280 / 0.2), oklch(0.70 0.18 330 / 0.12))",
              border: "1px solid oklch(0.72 0.20 280 / 0.25)",
              boxShadow: "0 0 12px oklch(0.72 0.20 280 / 0.12)",
              color: "oklch(0.72 0.20 280)",
            }}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              trend === "up"
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>

      {/* Micro sparkline bar */}
      <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: "oklch(0.22 0.020 265)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: trend === "down"
              ? "linear-gradient(90deg, oklch(0.62 0.22 18), oklch(0.62 0.22 18 / 0.6))"
              : "linear-gradient(90deg, oklch(0.72 0.20 280), oklch(0.72 0.17 215))",
            boxShadow: trend === "down"
              ? "0 0 8px oklch(0.62 0.22 18 / 0.4)"
              : "0 0 8px oklch(0.72 0.20 280 / 0.4)",
          }}
          initial={{ width: 0 }}
          animate={{ width: trend === "down" ? "35%" : "72%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </GlassCard>
  );
}

/* ============================================================
   SCORE RING
   ============================================================ */
export function ScoreRing({
  value,
  size = 132,
  stroke = 10,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - stroke) / 2;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  const uid    = `ring-${label ?? value}`;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          {/* Primary gradient */}
          <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="oklch(0.72 0.20 280)" />
            <stop offset="50%"  stopColor="oklch(0.72 0.17 215)" />
            <stop offset="100%" stopColor="oklch(0.76 0.17 155)" />
          </linearGradient>
          {/* Glow filter */}
          <filter id={`glow-${uid}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.22 0.020 265)"
          strokeWidth={stroke}
        />

        {/* Animated fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          filter={`url(#glow-${uid})`}
        />

        {/* Outer pulse ring at arc tip */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.72 0.20 280 / 0.3)"
          strokeWidth={stroke + 4}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ, opacity: 0 }}
          animate={{ strokeDashoffset: offset, opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 3 }}
        />
      </svg>

      {/* Center value */}
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
      {sublabel && <span className="mt-1 text-xs text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

/* ============================================================
   MINI PROGRESS
   ============================================================ */
export function MiniProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full", className)}
      style={{ background: "oklch(0.20 0.020 265)" }}
    >
      <motion.div
        className="h-full rounded-full relative"
        style={{
          background: "linear-gradient(90deg, oklch(0.72 0.20 280), oklch(0.72 0.17 215), oklch(0.76 0.17 155))",
          boxShadow: "0 0 10px oklch(0.72 0.20 280 / 0.5)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow edge */}
        <div
          className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full"
          style={{
            background: "oklch(0.72 0.20 280)",
            boxShadow: "0 0 8px 3px oklch(0.72 0.20 280 / 0.6)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ============================================================
   SECTION HEADING
   ============================================================ */
export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ============================================================
   FADE IN
   ============================================================ */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
      style={{
        background: "oklch(0.14 0.020 265 / 0.5)",
        border: "1px dashed oklch(0.72 0.20 280 / 0.2)",
      }}
    >
      <span
        className="mb-4 grid h-14 w-14 place-items-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, oklch(0.72 0.20 280 / 0.15), oklch(0.70 0.18 330 / 0.10))",
          border: "1px solid oklch(0.72 0.20 280 / 0.25)",
          color: "oklch(0.72 0.20 280)",
          boxShadow: "0 0 20px oklch(0.72 0.20 280 / 0.15)",
        }}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ============================================================
   SKELETON
   ============================================================ */
export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer rounded-xl", className)}
      style={{ background: "oklch(0.18 0.020 265 / 0.7)" }}
    />
  );
}

/* ============================================================
   PAGE HEADER
   ============================================================ */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <FadeIn className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-gradient md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </FadeIn>
  );
}

/* ============================================================
   STATUS PILL
   ============================================================ */
export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const tones: Record<string, string> = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger:  "bg-destructive/15 text-destructive",
    info:    "bg-info/15 text-info",
    neutral: "bg-muted text-muted-foreground",
  };

  const dotColors: Record<string, string> = {
    success: "oklch(0.74 0.17 155)",
    warning: "oklch(0.80 0.16 75)",
    danger:  "oklch(0.62 0.22 18)",
    info:    "oklch(0.72 0.15 225)",
    neutral: "oklch(0.60 0.020 260)",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      <span
        className={cn("h-1.5 w-1.5 rounded-full", tone === "success" && "animate-dot-pulse")}
        style={{ background: dotColors[tone] }}
      />
      {label}
    </span>
  );
}
