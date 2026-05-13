import { Link, useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";
import { MetricFlowLogo } from "@/brand/MetricFlowLogo";

export default function RouteErrorPage() {
  const err = useRouteError();
  const navigate = useNavigate();
  const message = isRouteErrorResponse(err)
    ? `${err.status} ${err.statusText}`
    : err instanceof Error
      ? err.message
      : "Something went wrong";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <MetricFlowLogo variant="mark" className="h-10 w-10 opacity-90" />
      <h1 className="font-display text-2xl font-semibold">MetricFlow hit an unexpected error</h1>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button type="button" asChild>
          <Link to={paths.overview}>Dashboard</Link>
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link to={paths.root}>Home</Link>
        </Button>
      </div>
    </div>
  );
}
