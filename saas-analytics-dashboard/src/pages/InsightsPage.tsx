import { Bot, Gauge, Radar } from "lucide-react";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_NAME } from "@/brand/constants";

const cards = [
  {
    title: "Pulse score",
    body: "Blends funnel velocity, invoice aging, and task throughput into a single 0–100 demo score.",
    icon: Gauge,
    tag: "Heuristic",
  },
  {
    title: "Anomaly watch",
    body: "Flags when seed revenue deviates from the prior month by more than 20%—no ML, just guardrails.",
    icon: Radar,
    tag: "Rules",
  },
  {
    title: "Narrator (static)",
    body: "Copy-ready insight: “EU traffic is outpacing NA—consider shifting paid spend.” Replace with LLM when ready.",
    icon: Bot,
    tag: "Copy",
  },
] as const;

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <DocumentTitle title={`AI Insights — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">AI Insights</h1>
        <p className="text-sm text-muted-foreground">Config-driven cards—no model calls in this portfolio slice.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title} className="border-primary/15 bg-gradient-to-b from-card to-card/60">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <c.icon className="h-4 w-4 text-primary" aria-hidden />
                  {c.title}
                </CardTitle>
                <Badge variant="secondary">{c.tag}</Badge>
              </div>
              <CardDescription>{c.body}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  );
}
