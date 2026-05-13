import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useChartSeedQuery } from "@/hooks/queries/useChartSeedQuery";
import { useActivityQuery } from "@/hooks/queries/useActivityQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/charts/ChartCard";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { WidgetShell } from "@/components/dashboard/WidgetShell";
import { MiniChart } from "@/components/dashboard/MiniChart";
import { LiveActivityFeed } from "@/components/system/LiveActivityFeed";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { useAnimatedKpi } from "@/hooks/useAnimatedKpi";
import { PRODUCT_NAME } from "@/brand/constants";

const PIE_COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24"];

export default function OverviewPage() {
  const { user } = useAuth();
  const seed = useChartSeedQuery();
  const activity = useActivityQuery(user?.uid);

  const kpis = useMemo(() => {
    const series = seed.data?.revenueSeries ?? [];
    const last = series[series.length - 1];
    const prev = series[series.length - 2];
    const revenue = last?.revenue ?? 0;
    const delta = prev ? Math.round(((last.revenue - prev.revenue) / prev.revenue) * 100) : 0;
    return { revenue, mrr: last?.mrr ?? 0, delta };
  }, [seed.data?.revenueSeries]);

  const revAnim = useAnimatedKpi(kpis.revenue);
  const mrrAnim = useAnimatedKpi(kpis.mrr);

  return (
    <div className="space-y-6">
      <DocumentTitle title={`Dashboard — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Static chart seed supplements Firestore aggregates for fast MetricFlow portfolio demos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Trailing revenue (seed)"
          value={seed.isLoading ? <Skeleton className="h-9 w-32" /> : `€${revAnim.toLocaleString()}`}
          hint={
            <>
              {kpis.delta >= 0 ? "+" : ""}
              {kpis.delta}% vs last month
            </>
          }
        />
        <KpiCard
          label="MRR (seed)"
          value={seed.isLoading ? <Skeleton className="h-9 w-28" /> : `€${mrrAnim.toLocaleString()}`}
          hint="Blended plans + add-ons"
        />
        <KpiCard
          label="Geo mix (seed)"
          value={
            seed.isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              `${(seed.data?.geoBars ?? []).find((g) => g.label === "EU")?.value ?? 0}% EU`
            )
          }
          hint="Illustrative regional share"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WidgetShell title="Velocity spark" description="Last six periods from seed JSON">
          <MiniChart
            data={(seed.data?.revenueSeries ?? []).slice(-6).map((r) => ({ ...r }))}
            dataKeyX="period"
            dataKeyY="mrr"
            gradientId="dashMrr"
            name="MRR"
          />
        </WidgetShell>
        <WidgetShell title="Devices" description="Where sessions land (seed)">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Pie
                  data={seed.data?.devicePie ?? []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                >
                  {(seed.data?.devicePie ?? []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </WidgetShell>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue & MRR" description="Combined time series (seed JSON)" isLoading={seed.isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seed.data?.revenueSeries ?? []} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#fillRev)" name="Revenue" />
              <Area type="monotone" dataKey="mrr" stroke="#a78bfa" fillOpacity={0} name="MRR" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Acquisition channels" description="Share of pipeline (seed)" isLoading={seed.isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seed.data?.channelBars ?? []} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Plan mix" description="Customers by plan tier" isLoading={seed.isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Pie data={seed.data?.planPie ?? []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {(seed.data?.planPie ?? []).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retention cohort" description="Illustrative quality scores" isLoading={seed.isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seed.data?.cohortBars ?? []} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live activity</CardTitle>
          <CardDescription>Blended synthetic events plus your workspace feed</CardDescription>
        </CardHeader>
        <CardContent>
          {activity.isLoading ? <Skeleton className="h-24 w-full" /> : <LiveActivityFeed items={activity.data} />}
        </CardContent>
      </Card>
    </div>
  );
}
