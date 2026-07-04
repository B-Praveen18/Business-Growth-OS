import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GlassCard, FadeIn, PageHeader, SectionHeading, StatCard } from "@/components/app/primitives";
import { getCurrentUser, updateUser, User } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  component: Profile,
});

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "Owner",
    email: "",
    phone: "",
    company: "",
    industry: "",
    monthlyRevenue: "",
    businessDescription: "",
  });

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
      setForm({
        name: stored.name,
        role: stored.role || "Owner",
        email: stored.email,
        phone: stored.phone ?? "",
        company: stored.company,
        industry: stored.industry ?? "",
        monthlyRevenue: stored.monthlyRevenue ?? "",
        businessDescription: stored.businessDescription ?? "",
      });
    } else {
      setForm({
        name: "Owner",
        role: "Owner",
        email: "owner@business.com",
        phone: "+1 (555) 018-2245",
        company: "Business",
        industry: "",
        monthlyRevenue: "",
        businessDescription: "",
      });
    }
  }, []);

  const initials = form.name
    .split(" ")
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveProfile = async () => {
    if (!user) {
      toast.error("Sign in first to save your profile.");
      return;
    }

    const updated: User = {
      ...user,
      name: form.name,
      role: form.role,
      email: form.email,
      phone: form.phone,
      company: form.company,
      industry: form.industry,
      monthlyRevenue: form.monthlyRevenue,
      businessDescription: form.businessDescription,
    };

    await updateUser(updated);
    setUser(updated);
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-8">
      <PageHeader title="User Profile" description="Manage your personal and business details for smarter AI prompts." />

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <FadeIn>
          <GlassCard glow className="flex h-full flex-col items-center gap-3 py-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-aurora text-2xl font-semibold text-background shadow-glow">
              {initials || "NW"}
            </span>
            <div>
              <p className="text-lg font-semibold">{form.name || "Owner"}</p>
              <p className="text-sm text-muted-foreground">{form.role || "Owner"}</p>
            </div>
            <span className="rounded-full bg-accent/60 px-3 py-1 text-xs text-muted-foreground">
              {form.company || "Business"}
            </span>
            <div className="space-y-2 pt-3 text-left text-sm text-muted-foreground">
              {form.industry && <p>Industry: {form.industry}</p>}
              {form.monthlyRevenue && <p>Revenue: {form.monthlyRevenue}</p>}
            </div>
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
                  <Input id="fn" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rl">Role</Label>
                  <Input id="rl" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="em">Email</Label>
                  <Input id="em" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">Phone</Label>
                  <Input id="ph" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
                </div>
              </div>
            </GlassCard>
            <GlassCard>
              <SectionHeading title="Business details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" value={form.industry} onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Monthly revenue</Label>
                  <Input id="monthlyRevenue" value={form.monthlyRevenue} onChange={(e) => setForm((prev) => ({ ...prev, monthlyRevenue: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business overview</Label>
                  <textarea
                    id="businessDescription"
                    value={form.businessDescription}
                    onChange={(e) => setForm((prev) => ({ ...prev, businessDescription: e.target.value }))}
                    placeholder="Describe what your business sells and who you serve."
                    className="min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            </GlassCard>
            <div className="mt-5 flex justify-end">
              <Button onClick={saveProfile}>Save changes</Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
