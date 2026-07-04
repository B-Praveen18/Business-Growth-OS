import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, FadeIn, PageHeader, EmptyState } from "@/components/app/primitives";
import { getNotifications, markAllNotificationsRead } from "@/lib/notifications-api";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldAlert, FileText, Settings2, BellOff, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/_app/notifications")({
  component: Notifications,
});

const typeMeta: Record<string, { Icon: typeof Sparkles; tone: string }> = {
  insight: { Icon: Sparkles, tone: "text-primary bg-primary/15" },
  alert: { Icon: ShieldAlert, tone: "text-warning bg-warning/15" },
  report: { Icon: FileText, tone: "text-success bg-success/15" },
  system: { Icon: Settings2, tone: "text-muted-foreground bg-accent/60" },
};

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

function Notifications() {
  const [items, setItems] = useState<any[]>([]);
  const unread = items.filter((n) => n.unread).length;

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        const mapped = (data.notifications || []).map((n: any) => ({
          id: n._id,
          title: n.title || "Notification",
          body: n.message,
          time: formatTime(n.createdAt),
          unread: !n.read,
          type: n.type || "system"
        }));
        setItems(mapped);
      } catch (err: any) {
        toast.error(err.message || "Failed to load notifications");
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unread} unread updates from your AI executive team.`}
        actions={
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await markAllNotificationsRead();
                setItems((xs) => xs.map((n) => ({ ...n, unread: false })));
                toast.success("All notifications marked as read");
              } catch (e: any) {
                toast.error(e.message || "Failed to mark as read");
              }
            }}
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={BellOff} title="You're all caught up" description="New insights and alerts will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => {
            const meta = typeMeta[n.type];
            return (
              <FadeIn key={n.id} delay={i * 0.03}>
                <GlassCard
                  hover
                  className={cn("flex items-start gap-4", n.unread && "border-primary/20 bg-primary/5")}
                >
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", meta.tone)}>
                    <meta.Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                      <p className="truncate text-sm font-semibold">{n.title}</p>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                </GlassCard>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
