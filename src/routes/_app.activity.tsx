import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, FadeIn, PageHeader, SectionHeading } from "@/components/app/primitives";
import { useState, useEffect } from "react";
import { getActivity } from "@/lib/activity-api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/activity")({
  component: ActivityHistory,
});

const typeMeta: Record<string, { Icon: typeof Sparkles; color: string }> = {
  decision: { Icon: CheckCircle2, color: "text-primary bg-primary/15" },
  insight: { Icon: Sparkles, color: "text-info bg-info/15" },
  alert: { Icon: ShieldAlert, color: "text-warning bg-warning/15" },
  report: { Icon: FileText, color: "text-success bg-success/15" },
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

function ActivityHistory() {
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActivity();
        const mapped = (data.activity || []).map((a: any) => ({
          id: a._id,
          actor: a.userId?.name || "User",
          action: a.action,
          time: formatTime(a.createdAt),
          type: "insight" // default or map from module
        }));
        setActivity(mapped);
      } catch (err: any) {
        toast.error(err.message || "Failed to load activity");
      }
    }
    load();
  }, []);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity History"
        description="A complete, chronological log of what your AI team and workspace have done."
      />
      <FadeIn>
        <GlassCard>
          <SectionHeading title="Recent activity" />
          <ol className="relative space-y-5 pl-8">
            <span className="absolute left-[15px] top-2 h-[calc(100%-1.5rem)] w-px bg-border" />
            {activity.map((a) => {
              const meta = typeMeta[a.type];
              return (
                <li key={a.id} className="relative flex items-start gap-4">
                  <span
                    className={cn(
                      "absolute -left-8 grid h-8 w-8 place-items-center rounded-xl ring-4 ring-background",
                      meta.color,
                    )}
                  >
                    <meta.Icon className="h-4 w-4" />
                  </span>
                  <div className="ml-2 flex flex-1 items-baseline justify-between gap-3">
                    <p className="text-sm">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
