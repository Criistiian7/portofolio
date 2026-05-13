import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useChartSeedQuery } from "@/hooks/queries/useChartSeedQuery";
import { ChartCard } from "@/components/charts/ChartCard";

export default function AnalyticsPage() {
  const seed = useChartSeedQuery();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deeper cuts reuse the same chart primitives as Overview.</p>
      </div>
      <ChartCard title="MRR trajectory" description="Line view of seed series" isLoading={seed.isLoading}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={seed.data?.revenueSeries ?? []} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="period" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
              }}
            />
            <Line type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
