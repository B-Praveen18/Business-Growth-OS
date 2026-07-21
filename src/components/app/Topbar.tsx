import { useEffect, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findNav } from "@/lib/nav";
import { getNotifications } from "@/lib/notifications-api";
import { getCurrentUser, User } from "@/lib/auth";
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  Settings,
  UserRound,
  LogOut,
  Sparkles,
  Command,
} from "lucide-react";

export function Topbar({
  onMenuClick,
  onSearchClick,
}: {
  onMenuClick: () => void;
  onSearchClick: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const current = findNav(pathname);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setUser(getCurrentUser());
    getNotifications().then(res => setNotifications(res.notifications || [])).catch(() => {});
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NW";

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-3 px-4 md:px-6"
      style={{
        background: "oklch(0.10 0.018 265 / 0.75)",
        backdropFilter: "blur(32px) saturate(160%)",
        borderBottom: "1px solid oklch(0.28 0.022 265 / 0.5)",
        boxShadow: "0 1px 0 oklch(0.72 0.20 280 / 0.08), 0 4px 24px -4px oklch(0 0 0 / 0.4)",
      }}
    >
      {/* Subtle top glow line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.20 280 / 0.5), oklch(0.72 0.17 215 / 0.4), transparent)" }}
      />

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        style={{ background: "oklch(0.20 0.022 265 / 0.6)", border: "1px solid oklch(0.28 0.022 265 / 0.4)" }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
        <Link
          to="/dashboard"
          className="font-medium transition-colors hover:text-primary"
          style={{ color: "oklch(0.72 0.20 280 / 0.9)" }}
        >
          BusinessOS
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
        <span className="truncate font-medium text-foreground/80">{current?.label ?? "Overview"}</span>
      </nav>

      {/* Search bar */}
      <button
        onClick={onSearchClick}
        className="group ml-auto flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground md:w-72"
        style={{
          background: "oklch(0.16 0.020 265 / 0.7)",
          border: "1px solid oklch(0.28 0.022 265 / 0.5)",
          boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.05)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.20 280 / 0.5)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px oklch(0.72 0.20 280 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.28 0.022 265 / 0.5)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "inset 0 1px 0 oklch(1 0 0 / 0.05)";
        }}
      >
        <Search className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary" />
        <span className="hidden flex-1 text-left md:inline">Search anything…</span>
        <kbd
          className="ml-auto hidden items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] md:flex"
          style={{
            background: "oklch(0.22 0.020 265 / 0.8)",
            border: "1px solid oklch(0.28 0.022 265 / 0.5)",
            color: "oklch(0.60 0.020 260)",
          }}
        >
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground"
            style={{
              background: "oklch(0.16 0.020 265 / 0.7)",
              border: "1px solid oklch(0.28 0.022 265 / 0.5)",
            }}
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <>
                {/* Pulse ring */}
                <span
                  className="animate-pulse-ring absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full"
                  style={{ background: "oklch(0.72 0.20 280 / 0.4)" }}
                />
                <span
                  className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))" }}
                >
                  {unread}
                </span>
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "oklch(0.72 0.20 280 / 0.15)", color: "oklch(0.72 0.20 280)" }}
            >
              {unread} new
            </span>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex-col items-start gap-0.5 py-2.5"
                onClick={() => navigate({ to: "/notifications" })}
              >
                <div className="flex w-full items-center gap-2">
                  {!n.read && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "oklch(0.72 0.20 280)" }}
                    />
                  )}
                  <span className="truncate text-sm font-medium">{n.title}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : n.time}
                  </span>
                </div>
                <span className="line-clamp-2 pl-3.5 text-xs text-muted-foreground">{n.message || n.body}</span>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate({ to: "/notifications" })}
            className="justify-center text-sm"
            style={{ color: "oklch(0.72 0.20 280)" }}
          >
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 transition-all duration-200"
            style={{
              background: "oklch(0.16 0.020 265 / 0.7)",
              border: "1px solid oklch(0.28 0.022 265 / 0.5)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.20 280 / 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.28 0.022 265 / 0.5)";
            }}
          >
            {/* Gradient avatar */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  padding: "1px",
                  background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.18 330))",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  borderRadius: "10px",
                }}
              />
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.20 280), oklch(0.70 0.20 330))" }}
              >
                {initials}
              </span>
            </div>
            <span className="hidden text-sm font-medium sm:inline">{user?.name ?? "Guest"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-2">
            <p className="text-sm font-semibold">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.role ?? "User"}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
            <UserRound className="h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/boardroom" })}>
            <Sparkles className="h-4 w-4" /> AI Boardroom
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate({ to: "/" })}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
