import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { ActivityLog } from "@/types";

const FAKE: Pick<ActivityLog, "id" | "type" | "message" | "createdAt">[] = [
  { id: "mf-fake-1", type: "system", message: "Forecast refreshed for EU region", createdAt: Date.now() - 120_000 },
  { id: "mf-fake-2", type: "billing", message: "Invoice INV-2042 marked paid", createdAt: Date.now() - 300_000 },
  { id: "mf-fake-3", type: "user", message: "Jordan invited a viewer to the workspace", createdAt: Date.now() - 900_000 },
  { id: "mf-fake-4", type: "task", message: "Release checklist moved to review", createdAt: Date.now() - 1_800_000 },
];

type Props = {
  items?: ActivityLog[];
  max?: number;
};

export function LiveActivityFeed({ items, max = 8 }: Props) {
  const reduce = useReducedMotion();
  const merged = useMemo(() => {
    const real = items ?? [];
    return [...FAKE, ...real].sort((a, b) => b.createdAt - a.createdAt).slice(0, max);
  }, [items, max]);

  return (
    <ul className="space-y-0 divide-y divide-border rounded-xl border border-border bg-card/40">
      {merged.map((a) => (
        <motion.li
          layout={!reduce}
          key={a.id}
          className="flex items-start justify-between gap-3 px-3 py-3"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div>
            <p className="text-sm">{a.message}</p>
            <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
          </div>
          <Badge variant="outline" className="capitalize">
            {a.type}
          </Badge>
        </motion.li>
      ))}
    </ul>
  );
}
