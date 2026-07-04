import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  StatCard,
} from "@/components/app/primitives";
import { RevenueAreaChart, GrowthLineChart, ChannelDonut, FunnelBarChart } from "@/components/app/charts";
import { kpis, revenueTrend, growthData, channelData, funnelData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  component: Analytics,
});

function Analytics() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Deep, cross-functional metrics across revenue, growth and conversion."
        actions={
          <Button variant="outline">
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
              <SectionHeading title="Revenue vs forecast" description="in $K" />
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
