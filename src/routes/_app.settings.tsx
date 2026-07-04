import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { GlassCard, FadeIn, PageHeader, SectionHeading } from "@/components/app/primitives";
import { getCurrentUser, updateUser, type User } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
});

const prefs = [
  { label: "Daily executive briefing", desc: "A morning summary delivered to your inbox.", on: true },
  { label: "Risk alerts", desc: "Notify me when a new high-severity risk appears.", on: true },
  { label: "Weekly reports", desc: "Auto-generate and deliver weekly reports.", on: true },
  { label: "Agent activity", desc: "Notify me when agents take significant actions.", on: false },
];

function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    company: "",
    website: "",
    timezone: "",
  });

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
      setForm({
        company: stored.company || "",
        website: stored.website || "northwind.com",
        timezone: stored.timezone || "America/New_York",
      });
    }
  }, []);

  const saveSettings = async () => {
    if (!user) {
      toast.error("Sign in first to save settings.");
      return;
    }
    try {
      const updated: User = {
        ...user,
        company: form.company,
        website: form.website,
        timezone: form.timezone,
      };
      await updateUser(updated);
      setUser(updated);
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your workspace, preferences and integrations." />
      <FadeIn>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <GlassCard>
              <SectionHeading title="Workspace" description="Basic company information" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cn">Company name</Label>
                  <Input
                    id="cn"
                    value={form.company}
                    onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pl">Plan</Label>
                  <Input id="pl" defaultValue="Enterprise" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Website</Label>
                  <Input
                    id="url"
                    value={form.website}
                    onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">Timezone</Label>
                  <Input
                    id="tz"
                    value={form.timezone}
                    onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={saveSettings}>Save changes</Button>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <GlassCard>
              <SectionHeading title="Notification preferences" />
              <div className="divide-y divide-border/60">
                {prefs.map((p) => (
                  <div key={p.label} className="flex items-center justify-between py-4">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <Switch defaultChecked={p.on} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <GlassCard>
              <SectionHeading title="Billing" description="Your subscription and usage" />
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-accent/40 p-5">
                <div>
                  <p className="text-sm font-semibold">Enterprise plan</p>
                  <p className="text-xs text-muted-foreground">Billed annually · renews Jan 2027</p>
                </div>
                <Button variant="outline" onClick={() => toast.info("Manage billing")}>
                  Manage subscription
                </Button>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
