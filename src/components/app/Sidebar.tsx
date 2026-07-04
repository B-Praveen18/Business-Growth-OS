import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { navGroups, bottomNav } from "@/lib/nav";
import { getCurrentUser, User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Sparkles, X } from "lucide-react";

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
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-aurora shadow-glow">
          <Sparkles className="h-4.5 w-4.5 text-background" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">BusinessOS</p>
          <p className="truncate text-xs text-muted-foreground">Growth OS</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
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
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl bg-accent/80 ring-1 ring-white/5"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <item.icon className="relative z-10 h-4.5 w-4.5 shrink-0" />
                      <span className="relative z-10 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "relative z-10 ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            item.badge === "Live"
                              ? "bg-success/20 text-success"
                              : "bg-primary/20 text-primary",
                          )}
                        >
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

      {/* Bottom */}
      <div className="border-t border-border/60 px-3 py-3">
        <ul className="space-y-0.5">
          {bottomNav.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent/80 text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-accent/40 px-3 py-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-aurora text-xs font-semibold text-background">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{profileName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{profileRole}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-[264px] shrink-0 border-r border-border/60 bg-sidebar lg:block">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="absolute inset-y-0 left-0 w-[280px] border-r border-border/60 bg-sidebar"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}


