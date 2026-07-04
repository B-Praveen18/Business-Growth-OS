import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { GlassCard, FadeIn, PageHeader, SectionHeading } from "@/components/app/primitives";
import { company } from "@/lib/mock-data";
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
                  <Input id="cn" defaultValue={company.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pl">Plan</Label>
                  <Input id="pl" defaultValue={company.plan} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Website</Label>
                  <Input id="url" defaultValue="northwind.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">Timezone</Label>
                  <Input id="tz" defaultValue="America/New_York" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
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
