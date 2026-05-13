export const paths = {
  root: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  app: "/app",
  overview: "/app/overview",
  analytics: "/app/analytics",
  users: "/app/users",
  subscriptions: "/app/subscriptions",
  sales: "/app/sales",
  invoices: "/app/invoices",
  tasks: "/app/tasks",
  activity: "/app/activity",
  settings: "/app/settings",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
