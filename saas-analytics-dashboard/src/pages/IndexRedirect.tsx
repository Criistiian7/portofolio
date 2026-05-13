import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/lib/paths";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";

export default function IndexRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSkeleton />;
  if (user) return <Navigate to={paths.overview} replace />;
  return <Navigate to={paths.login} replace />;
}
