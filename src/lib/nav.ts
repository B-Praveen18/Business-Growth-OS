import {
  LayoutDashboard,
  HeartPulse,
  FileText,
  Users,
  Crown,
  Megaphone,
  TrendingUp,
  Wallet,
  Settings2,
  Swords,
  ShieldAlert,
  Sparkles,
  Map,
  BarChart3,
  ScrollText,
  Bell,
  History,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Business Health", to: "/health", icon: HeartPulse },
      { label: "Executive Summary", to: "/executive-summary", icon: FileText },
    ],
  },
  {
    label: "AI Agents",
    items: [
      { label: "AI Boardroom", to: "/boardroom", icon: Users, badge: "Live" },
      { label: "CEO Agent", to: "/agents/ceo", icon: Crown },
      { label: "Marketing Agent", to: "/agents/marketing", icon: Megaphone },
      { label: "Sales Agent", to: "/agents/sales", icon: TrendingUp },
      { label: "Finance Agent", to: "/agents/finance", icon: Wallet },
      { label: "Operations Agent", to: "/agents/operations", icon: Settings2 },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Competitor Analysis", to: "/competitors", icon: Swords },
      { label: "Risk Analysis", to: "/risk", icon: ShieldAlert },
      { label: "AI Recommendations", to: "/recommendations", icon: Sparkles },
      { label: "Growth Roadmap", to: "/roadmap", icon: Map },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", to: "/analytics", icon: BarChart3 },
      { label: "Reports", to: "/reports", icon: ScrollText },
    ],
  },
  {
    label: "Activity",
    items: [
      { label: "Notifications", to: "/notifications", icon: Bell, badge: "6" },
      { label: "Activity History", to: "/activity", icon: History },
    ],
  },
];

export const bottomNav: NavItem[] = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Profile", to: "/profile", icon: UserRound },
];

export const allNavItems: NavItem[] = [
  ...navGroups.flatMap((g) => g.items),
  ...bottomNav,
];

export function findNav(pathname: string): NavItem | undefined {
  return allNavItems.find((i) => i.to === pathname);
}
