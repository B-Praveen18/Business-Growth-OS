import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { GlassCard, FadeIn, PageHeader, SectionHeading, StatCard } from "@/components/app/primitives";
import { company } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-8">
      <PageHeader title="User Profile" description="Manage your personal details and preferences." />

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <FadeIn>
          <GlassCard glow className="flex h-full flex-col items-center gap-3 py-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-aurora text-2xl font-semibold text-background shadow-glow">
              {company.initials}
            </span>
            <div>
              <p className="text-lg font-semibold">{company.founder}</p>
              <p className="text-sm text-muted-foreground">{company.role}</p>
            </div>
            <span className="rounded-full bg-accent/60 px-3 py-1 text-xs text-muted-foreground">
              {company.name} · {company.plan}
            </span>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info("Upload a new photo")}>
              Change avatar
            </Button>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid h-full gap-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Decisions made" value="128" icon={CheckCircle2} />
              <StatCard label="Boardroom sessions" value="34" icon={Sparkles} />
              <StatCard label="Actions accepted" value="76" icon={Zap} />
            </div>
            <GlassCard>
              <SectionHeading title="Personal details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fn">Full name</Label>
                  <Input id="fn" defaultValue={company.founder} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rl">Role</Label>
                  <Input id="rl" defaultValue={company.role} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="em">Email</Label>
                  <Input id="em" type="email" defaultValue="alex@northwind.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">Phone</Label>
                  <Input id="ph" defaultValue="+1 (555) 018-2245" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
              </div>
            </GlassCard>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
