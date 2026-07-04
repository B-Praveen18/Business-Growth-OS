import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatCard,
} from "@/components/app/primitives";
import { RevenueAreaChart, GrowthLineChart, ChannelDonut, FunnelBarChart } from "@/components/app/charts";
import { useEffect, useState } from "react";
import { getMetrics } from "@/lib/metrics-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  component: Analytics,
});

function Analytics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getMetrics();
        setMetrics(res.metrics || []);
      } catch (err) {
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const exportData = () => {
    if (!metrics || metrics.length === 0) {
      toast.error("No metrics data to export.");
      return;
    }
    const headers = ["Metric Name", "Value", "Created At"];
    const rows = metrics.map((m: any) => [
      `"${m.name.replace(/"/g, '""')}"`,
      m.value,
      m.createdAt || ""
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "analytics_metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  const getVal = (name: string, fallback: number) => {
    const m = metrics.find((x: any) => x.name === name);
    return m ? Number(m.value) : fallback;
  };

  const kpis = [
    { label: "Monthly Recurring Revenue", value: `₹${getVal('mrr', 482900).toLocaleString()}`, delta: "+12.4%", trend: "up" as const },
    { label: "Active Customers", value: getVal('customers', 3284).toLocaleString(), delta: "+4.1%", trend: "up" as const },
    { label: "Net Revenue Retention", value: `${getVal('nrr', 118)}%`, delta: "+2.3%", trend: "up" as const },
    { label: "Customer Acquisition Cost", value: `₹${getVal('cac', 212)}`, delta: "-8.7%", trend: "up" as const },
    { label: "Burn Multiple", value: `${getVal('burnMultiple', 1.2)}x`, delta: "-0.3x", trend: "up" as const },
    { label: "Churn Rate", value: `${getVal('churnRate', 1.9)}%`, delta: "+0.4%", trend: "down" as const },
  ];

  const revenueTrend = metrics.find(m => m.name === 'revenueTrend')?.history || [
    { month: "Jan", revenue: 312, forecast: 300, target: 320 },
    { month: "Feb", revenue: 328, forecast: 325, target: 340 },
    { month: "Mar", revenue: 355, forecast: 350, target: 360 },
    { month: "Apr", revenue: 372, forecast: 378, target: 385 },
    { month: "May", revenue: 401, forecast: 405, target: 410 },
    { month: "Jun", revenue: 428, forecast: 430, target: 440 },
    { month: "Jul", revenue: 451, forecast: 458, target: 465 },
    { month: "Aug", revenue: 483, forecast: 486, target: 495 },
  ];

  const growthData = metrics.find(m => m.name === 'growthData')?.history || [
    { month: "Jan", users: 1820, leads: 640 },
    { month: "Feb", users: 2010, leads: 720 },
    { month: "Mar", users: 2240, leads: 810 },
    { month: "Apr", users: 2490, leads: 905 },
    { month: "May", users: 2760, leads: 1010 },
    { month: "Jun", users: 2980, leads: 1120 },
    { month: "Jul", users: 3130, leads: 1240 },
    { month: "Aug", users: 3284, leads: 1360 },
  ];

  const channelData = metrics.find(m => m.name === 'channelData')?.history || [
    { name: "Organic", value: 38, color: "var(--chart-1)" },
    { name: "Paid", value: 26, color: "var(--chart-2)" },
    { name: "Referral", value: 21, color: "var(--chart-3)" },
    { name: "Outbound", value: 15, color: "var(--chart-4)" },
  ];

  const funnelData = metrics.find(m => m.name === 'funnelData')?.history || [
    { stage: "Visitors", value: 100 },
    { stage: "Signups", value: 62 },
    { stage: "Activated", value: 41 },
    { stage: "Paying", value: 24 },
    { stage: "Expansion", value: 11 },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Deep, cross-functional metrics across revenue, growth and conversion."
        actions={
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <StatCard key={k.label} {...k} />
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="mt-4">
            <GlassCard>
              <SectionHeading title="Revenue vs forecast" description="in ₹K" />
              <RevenueAreaChart data={revenueTrend} />
            </GlassCard>
          </TabsContent>
          <TabsContent value="growth" className="mt-4">
            <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
              <GlassCard>
                <SectionHeading title="Users & leads" />
                <GrowthLineChart data={growthData} />
              </GlassCard>
              <GlassCard>
                <SectionHeading title="Acquisition mix" />
                <ChannelDonut data={channelData} />
              </GlassCard>
            </div>
          </TabsContent>
          <TabsContent value="conversion" className="mt-4">
            <GlassCard>
              <SectionHeading title="Conversion funnel" description="Visitor to expansion, %" />
              <FunnelBarChart data={funnelData} />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
