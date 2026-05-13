import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeBridge } from "@/components/system/ThemeBridge";
import { FullPageSkeleton } from "@/components/system/FullPageSkeleton";
import { ProtectedLayout } from "@/routes/ProtectedLayout";
import IndexRedirect from "@/pages/IndexRedirect";
import AuthLayout from "@/pages/AuthLayout";
import AppShellLayout from "@/pages/AppShellLayout";
import RouteErrorPage from "@/pages/RouteErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const OverviewPage = lazy(() => import("@/pages/OverviewPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const SubscriptionsPage = lazy(() => import("@/pages/SubscriptionsPage"));
const SalesPage = lazy(() => import("@/pages/SalesPage"));
const InvoicesPage = lazy(() => import("@/pages/InvoicesPage"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));
const ActivityPage = lazy(() => import("@/pages/ActivityPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

function RenderErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="font-display text-xl font-semibold">Something broke</h1>
      <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
      <button
        type="button"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          <ThemeBridge />
          <Toaster richColors position="top-center" closeButton />
          <ErrorBoundary FallbackComponent={RenderErrorFallback}>
            <Suspense fallback={<FullPageSkeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export const router = createBrowserRouter([
    {
      path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <IndexRedirect /> },
      {
        path: "login",
        element: <AuthLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        path: "register",
        element: <AuthLayout />,
        children: [{ index: true, element: <RegisterPage /> }],
      },
      {
        path: "forgot-password",
        element: <AuthLayout />,
        children: [{ index: true, element: <ForgotPasswordPage /> }],
      },
      {
        path: "app",
        element: <ProtectedLayout />,
        children: [
          {
            element: <AppShellLayout />,
            children: [
              { index: true, element: <Navigate to="overview" replace /> },
              { path: "overview", element: <OverviewPage /> },
              { path: "analytics", element: <AnalyticsPage /> },
              { path: "users", element: <UsersPage /> },
              { path: "subscriptions", element: <SubscriptionsPage /> },
              { path: "sales", element: <SalesPage /> },
              { path: "invoices", element: <InvoicesPage /> },
              { path: "tasks", element: <TasksPage /> },
              { path: "activity", element: <ActivityPage /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
