import { createFileRoute } from "@tanstack/react-router";
import {
  GlassCard,
  SectionHeading,
  FadeIn,
  PageHeader,
  MiniProgress,
  StatusPill,
} from "@/components/app/primitives";
import { competitors } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, Plus, Check, X } from "lucide-react";

export const Route = createFileRoute("/_app/competitors")({
  component: Competitors,
});

const momentumIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };

function Competitors() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Competitor Analysis"
        description="Track rivals, positioning and market momentum — continuously monitored."
        actions={
          <Button>
            <Plus className="h-4 w-4" /> Add competitor
          </Button>
        }
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {competitors.map((c) => {
            const Icon = momentumIcon[c.momentum];
            return (
              <GlassCard key={c.name} hover className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/60 text-sm font-semibold">
                    {c.name.slice(0, 2)}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs ${
                      c.momentum === "up"
                        ? "text-success"
                        : c.momentum === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {c.momentum}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.positioning}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Market share</span>
                    <span className="font-medium text-foreground">{c.marketShare}%</span>
                  </div>
                  <MiniProgress value={c.marketShare} className="mt-1.5" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <GlassCard className="p-0">
          <div className="p-5 pb-0">
            <SectionHeading title="Competitive matrix" description="Strengths and weaknesses at a glance" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor</TableHead>
                <TableHead>Positioning</TableHead>
                <TableHead>Share</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Weakness</TableHead>
                <TableHead className="text-right">Momentum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.positioning}</TableCell>
                  <TableCell>{c.marketShare}%</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm text-success">
                      <Check className="h-3.5 w-3.5" /> {c.strength}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <X className="h-3.5 w-3.5 text-destructive" /> {c.weakness}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusPill
                      label={c.momentum}
                      tone={c.momentum === "up" ? "success" : c.momentum === "down" ? "danger" : "neutral"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      </FadeIn>

      <FadeIn delay={0.12}>
        <GlassCard className="bg-primary/5">
          <SectionHeading title="Where you win" description="Your differentiation vs the field" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "Product velocity", d: "Shipping 2.3x faster than the enterprise incumbent." },
              { t: "AI-native experience", d: "The only true AI operating system in the category." },
              { t: "Expansion economics", d: "118% net revenue retention leads the market." },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-border/50 p-4">
                <p className="text-sm font-semibold">{x.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
