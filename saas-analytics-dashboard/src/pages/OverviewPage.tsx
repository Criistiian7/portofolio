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
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChartSeedQuery } from "@/hooks/queries/useChartSeedQuery";
import { useActivityQuery } from "@/hooks/queries/useActivityQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/charts/ChartCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Static chart seed supplements Firestore aggregates for fast portfolio demos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Trailing revenue</CardDescription>
            <CardTitle className="font-display text-3xl">
              {seed.isLoading ? <Skeleton className="h-9 w-32" /> : `€${kpis.revenue.toLocaleString()}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {kpis.delta >= 0 ? "+" : ""}
            {kpis.delta}% vs last month (seed)
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>MRR</CardDescription>
            <CardTitle className="font-display text-3xl">
              {seed.isLoading ? <Skeleton className="h-9 w-28" /> : `€${kpis.mrr.toLocaleString()}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Blended plans + add-ons</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Notifications</CardDescription>
            <CardTitle className="flex items-center gap-2 font-display text-3xl">
              <Bell className="h-6 w-6 text-primary" />
              Stub
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Wire to Cloud Messaging or in-app feed when you go beyond the portfolio slice.
          </CardContent>
        </Card>
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
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest events for your workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activity.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (activity.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            activity.data?.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {a.type}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
