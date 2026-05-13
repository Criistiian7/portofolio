export const paths = {
  root: "/",
  pricing: "/pricing",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  app: "/app",
  overview: "/app/overview",
  analytics: "/app/analytics",
  revenue: "/app/revenue",
  customers: "/app/customers",
  team: "/app/team",
  subscriptions: "/app/subscriptions",
  reports: "/app/reports",
  insights: "/app/insights",
  notifications: "/app/notifications",
  integrations: "/app/integrations",
  /** @deprecated Use `paths.customers` — kept for redirects */
  users: "/app/users",
  /** @deprecated Prefer `paths.revenue` — kept for redirects */
  sales: "/app/sales",
  invoices: "/app/invoices",
  tasks: "/app/tasks",
  activity: "/app/activity",
  settings: "/app/settings",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
