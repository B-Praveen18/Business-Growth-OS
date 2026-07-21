import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { navGroups, bottomNav } from "@/lib/nav";
import { getCurrentUser, User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Sparkles, X, Zap } from "lucide-react";

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const initials = user
    ? user.name
        .split(" ")
        .map((word) => word[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NW";

  const profileName = user?.name ?? "Guest";
  const profileRole = user?.role ?? "User";

  const content = (
    <div className="flex h-full flex-col">

      {/* ── Brand ── */}
      <div className="relative flex items-center gap-3 px-5 py-5">
        {/* Logo with orbit ring */}
        <div className="relative shrink-0">
          {/* Outer orbit ring */}
          <div
            className="animate-orbit absolute -inset-1.5 rounded-2xl"
            style={{
              background: "conic-gradient(from 0deg, oklch(0.72 0.20 280 / 0.8), oklch(0.70 0.18 330 / 0.5), oklch(0.72 0.17 215 / 0.6), oklch(0.72 0.20 280 / 0.8))",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1.5px",
              borderRadius: "14px",
            }}
          />
          <span
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
              boxShadow: "0 0 20px oklch(0.72 0.20 280 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.2)",
            }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </span>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-gradient-neon animate-neon-flicker">
            BusinessOS
          </p>
          <p className="truncate text-[11px] text-muted-foreground">Growth OS</p>
        </div>

        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Gradient separator ── */}
      <div
        className="mx-4 mb-2 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.4), transparent)" }}
      />

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "oklch(0.72 0.20 280 / 0.7)" }}
            >
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="nav-active-glow absolute inset-0 rounded-xl"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      {/* Hover bg */}
                      {!active && (
                        <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          style={{ background: "oklch(0.72 0.20 280 / 0.06)" }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "relative z-10 h-4 w-4 shrink-0 transition-colors",
                          active ? "text-primary" : "group-hover:text-primary/80",
                        )}
                      />
                      <span className="relative z-10 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "relative z-10 ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                            item.badge === "Live"
                              ? "bg-success/20 text-success"
                              : "bg-primary/20 text-primary",
                          )}
                        >
                          {item.badge === "Live" && (
                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success animate-dot-pulse" />
                          )}
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Bottom nav ── */}
      <div className="px-3 pb-2">
        <ul className="space-y-0.5">
          {bottomNav.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                    active
                      ? "nav-active-glow text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  style={!active ? {} : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Gradient separator ── */}
      <div
        className="mx-4 mt-1 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.3), transparent)" }}
      />

      {/* ── User profile card ── */}
      <div className="p-3 pt-2">
        <div
          className="glass-card card-edge flex items-center gap-3 rounded-xl p-3"
          style={{ boxShadow: "0 0 0 1px oklch(0.72 0.20 280 / 0.12) inset" }}
        >
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                padding: "1.5px",
                background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                borderRadius: "999px",
              }}
            />
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.20 330))",
                boxShadow: "0 0 12px oklch(0.72 0.20 280 / 0.4)",
              }}
            >
              {initials}
            </span>
            {/* Status online dot */}
            <span
              className="animate-dot-pulse absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2"
              style={{
                background: "oklch(0.74 0.17 155)",
                borderColor: "oklch(0.12 0.018 265)",
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">{profileName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{profileRole}</p>
          </div>

          <Zap className="h-3.5 w-3.5 shrink-0 text-primary opacity-70" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden w-[260px] shrink-0 lg:block"
        style={{
          background: "oklch(0.12 0.018 265 / 0.95)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid oklch(0.28 0.022 265 / 0.5)",
        }}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="absolute inset-y-0 left-0 w-[260px]"
              style={{
                background: "oklch(0.12 0.018 265 / 0.98)",
                backdropFilter: "blur(24px)",
                borderRight: "1px solid oklch(0.28 0.022 265 / 0.5)",
              }}
            >
              {content}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
