import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/lib/paths";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";

export function ProtectedLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageSkeleton />;
  }
  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
