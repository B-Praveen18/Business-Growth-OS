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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
          BusinessOS
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        <span className="truncate font-medium">{current?.label ?? "Overview"}</span>
      </nav>

      {/* Search */}
      <button
        onClick={onSearchClick}
        className="ml-auto flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/70 md:w-72"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden md:inline">Search anything…</span>
        <kbd className="ml-auto hidden rounded-md border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] md:inline">
          ⌘K
        </kbd>
      </button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative rounded-xl border border-border/60 bg-secondary/40 p-2 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            <span className="text-xs text-muted-foreground">{unread} new</span>
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
                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
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
          <DropdownMenuItem onClick={() => navigate({ to: "/notifications" })} className="justify-center text-sm text-primary">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 py-1 pl-1 pr-2 transition-colors hover:bg-secondary/70">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-aurora text-xs font-semibold text-background">
              {initials}
            </span>
            <span className="hidden text-sm font-medium sm:inline">{user?.name ?? "Guest"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.name ?? "Guest"}</p>
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
          <DropdownMenuItem onClick={() => navigate({ to: "/" })} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}



