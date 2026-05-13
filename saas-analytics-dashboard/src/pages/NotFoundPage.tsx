import { Link } from "react-router-dom";
import { paths } from "@/lib/paths";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <Button asChild>
        <Link to={paths.overview}>Back to overview</Link>
      </Button>
    </div>
  );
}
