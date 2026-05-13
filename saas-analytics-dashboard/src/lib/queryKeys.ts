export const queryKeys = {
  all: ["app"] as const,
  profile: (uid: string) => ["profile", uid] as const,
  users: (uid: string) => ["users", uid] as const,
  tasks: (uid: string) => ["tasks", uid] as const,
  invoices: (uid: string) => ["invoices", uid] as const,
  activity: (uid: string) => ["activity", uid] as const,
  subscriptions: (uid: string) => ["subscriptions", uid] as const,
  sales: (uid: string) => ["sales", uid] as const,
  chartSeed: () => ["chart-seed"] as const,
  globalSearch: (uid: string, q: string) => ["global-search", uid, q] as const,
};
