import type { ReactNode } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

type Row = Record<string, string | number>;

type MiniChartProps = {
  data: Row[];
  dataKeyX: string;
  dataKeyY: string;
  className?: string;
  gradientId: string;
  name?: string;
  emptyFallback?: ReactNode;
};

export function MiniChart({
  data,
  dataKeyX,
  dataKeyY,
  className,
  gradientId,
  name,
  emptyFallback,
}: MiniChartProps) {
  if (!data.length) {
    return (
      <div className={cn("flex h-full min-h-[140px] items-center justify-center text-sm text-muted-foreground", className)}>
        {emptyFallback ?? "No series"}
      </div>
    );
  }
  return (
    <div className={cn("h-40 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 4, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={dataKeyX} hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKeyY}
            stroke="hsl(var(--primary))"
            fill={`url(#${gradientId})`}
            name={name ?? dataKeyY}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
