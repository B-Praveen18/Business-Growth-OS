import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/app/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Building2 } from "lucide-react";
import { registerUser } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = (form.get("name") ?? "").toString().trim();
    const company = (form.get("company") ?? "").toString().trim();
    const email = (form.get("email") ?? "").toString().trim();
    const password = (form.get("password") ?? "").toString();
    const industry = (form.get("industry") ?? "").toString().trim();
    const monthlyRevenue = (form.get("monthlyRevenue") ?? "").toString().trim();
    const businessDescription = (form.get("businessDescription") ?? "").toString().trim();
    const role = (form.get("role") ?? "Owner").toString().trim() || "Owner";

    try {
      await registerUser({
        name,
        company,
        role,
        email,
        password,
        industry,
        monthlyRevenue,
        businessDescription,
      });
      toast.success("Account created — welcome to BusinessOS");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start growing with your AI executive team"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" name="name" placeholder="Alex Rivera" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="company" name="company" placeholder="Northwind Labs" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Business industry</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="industry" name="industry" placeholder="Bakery" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyRevenue">Monthly revenue</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="monthlyRevenue" name="monthlyRevenue" placeholder="$32,000" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessDescription">Business overview</Label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            placeholder="We bake artisan bread and supply local cafes."
            className="min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" name="email" type="email" placeholder="you@company.com" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" name="password" type="password" placeholder="Create a password" required className="pl-9" />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to BusinessOS's Terms & Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}


