import { FileText, LineChart } from "lucide-react";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PRODUCT_NAME } from "@/brand/constants";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <DocumentTitle title={`Reports — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Static report cards—swap for PDF export or scheduled digests.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LineChart className="h-4 w-4 text-primary" aria-hidden />
              Executive summary
            </CardTitle>
            <CardDescription>Week-over-week revenue delta, churn stub, expansion NRR placeholder.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Wire a Cloud Function or BigQuery export here. The layout is ready for a “Download PDF” action.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" aria-hidden />
              Compliance pack
            </CardTitle>
            <CardDescription>Audit trail excerpt + data residency note.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Portfolio placeholder: link DPA, subprocessors, and ROPA when you graduate from demo mode.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
