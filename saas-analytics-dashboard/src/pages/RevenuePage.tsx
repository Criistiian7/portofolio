import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChartSeedQuery } from "@/hooks/queries/useChartSeedQuery";
import { useInvoicesQuery } from "@/hooks/queries/useInvoicesQuery";
import { useSalesQuery } from "@/hooks/queries/useSalesQuery";
import { useSubscriptionsQuery } from "@/hooks/queries/useSubscriptionsQuery";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { WidgetShell } from "@/components/dashboard/WidgetShell";
import { MiniChart } from "@/components/dashboard/MiniChart";
import { useAnimatedKpi } from "@/hooks/useAnimatedKpi";
import { PRODUCT_NAME } from "@/brand/constants";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function RevenuePage() {
  const { user } = useAuth();
  const seed = useChartSeedQuery();
  const subs = useSubscriptionsQuery(user?.uid);
  const sales = useSalesQuery(user?.uid);
  const invoices = useInvoicesQuery(user?.uid);

  const mrr = useMemo(() => (subs.data ?? []).reduce((s, r) => s + r.mrr, 0), [subs.data]);
  const pipeline = useMemo(() => (sales.data ?? []).reduce((s, r) => s + r.amount, 0), [sales.data]);
  const collected = useMemo(
    () => (invoices.data ?? []).filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    [invoices.data],
  );

  const mrrDisplay = useAnimatedKpi(mrr);
  const pipeDisplay = useAnimatedKpi(pipeline);
  const collectedDisplay = useAnimatedKpi(collected);

  const lastArr = seed.data?.revenueSeries?.[seed.data.revenueSeries.length - 1]?.revenue ?? 0;
  const arrDisplay = useAnimatedKpi(lastArr);

  return (
    <div className="space-y-6">
      <DocumentTitle title={`Revenue — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Revenue</h1>
        <p className="text-sm text-muted-foreground">
          Roll-up of subscriptions, paid invoices, and pipeline—seed charts add context without extra queries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Booked ARR (seed)" value={`€${arrDisplay.toLocaleString()}`} hint="Trailing point from chart JSON" />
        <KpiCard label="Live MRR (workspace)" value={`€${mrrDisplay.toLocaleString()}`} hint="Sum of subscription rows" />
        <KpiCard label="Pipeline (sales)" value={`€${pipeDisplay.toLocaleString()}`} hint="Open opportunities snapshot" />
        <KpiCard label="Cash collected (paid inv.)" value={`€${collectedDisplay.toLocaleString()}`} hint="Paid invoices only" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WidgetShell title="ARR curve" description="Static seed — mirrors Overview">
          <MiniChart
            data={(seed.data?.revenueSeries ?? []).map((r) => ({ ...r }))}
            dataKeyX="period"
            dataKeyY="revenue"
            gradientId="revMini"
            name="Revenue"
          />
        </WidgetShell>
        <WidgetShell title="Conversion funnel" description="Portfolio narrative data">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seed.data?.funnelBars ?? []} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetShell>
      </div>
    </div>
  );
}
