import { Link } from "react-router-dom";
import { paths } from "@/lib/paths";
import { Button } from "@/components/ui/button";
import { MetricFlowLogo } from "@/brand/MetricFlowLogo";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <MetricFlowLogo variant="mark" className="h-10 w-10 opacity-90" />
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="font-display text-2xl font-semibold">This MetricFlow route does not exist</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Check the URL, or return to the public landing or your authenticated dashboard.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild variant="outline">
          <Link to={paths.root}>Marketing home</Link>
        </Button>
        <Button asChild>
          <Link to={paths.overview}>Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
