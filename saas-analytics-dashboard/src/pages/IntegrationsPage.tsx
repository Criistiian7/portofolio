import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plug, Webhook } from "lucide-react";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PRODUCT_NAME } from "@/brand/constants";

const STORAGE_KEY = "metricflow-integrations";

type Conn = { id: string; name: string; blurb: string };

const DEFAULTS: Conn[] = [
  { id: "stripe", name: "Stripe", blurb: "Billing webhooks & payout status" },
  { id: "slack", name: "Slack", blurb: "Alert routing to #finance-ops" },
  { id: "warehouse", name: "Snowflake", blurb: "Nightly ARR snapshot job" },
  { id: "crm", name: "HubSpot", blurb: "Deal stage sync for pipeline KPIs" },
];

function loadState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return Object.fromEntries(DEFAULTS.map((d) => [d.id, d.id === "stripe"]));
    return { ...Object.fromEntries(DEFAULTS.map((d) => [d.id, false])), ...JSON.parse(raw) };
  } catch {
    return Object.fromEntries(DEFAULTS.map((d) => [d.id, false]));
  }
}

export default function IntegrationsPage() {
  const [map, setMap] = useState<Record<string, boolean>>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }, [map]);

  const rows = useMemo(() => DEFAULTS, []);

  return (
    <div className="space-y-6">
      <DocumentTitle title={`Integrations — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground">Fake connectors with local “connected” state—persists in this browser.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plug className="h-4 w-4 text-primary" aria-hidden />
                  {r.name}
                </CardTitle>
                <CardDescription>{r.blurb}</CardDescription>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">{map[r.id] ? "Connected" : "Off"}</span>
                <Switch
                  checked={Boolean(map[r.id])}
                  onCheckedChange={(v) => {
                    setMap((m) => ({ ...m, [r.id]: v }));
                    toast.message(v ? `${r.name} connected (demo)` : `${r.name} disconnected`);
                  }}
                  aria-label={`Toggle ${r.name}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" size="sm" className="gap-2" disabled={!map[r.id]}>
                <Webhook className="h-4 w-4" aria-hidden />
                View sample payload
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
