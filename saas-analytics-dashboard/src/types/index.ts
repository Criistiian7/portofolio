export type UserRole = "admin" | "manager" | "member" | "billing";

export type UserStatus = "active" | "invited" | "suspended";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string | null;
  status: UserStatus;
  preferences: {
    emailDigest: boolean;
    marketing: boolean;
    tableDensity: "comfortable" | "compact";
  };
}

/** Row in the Users table (team / directory), scoped by `ownerId`. */
export interface OrgUser {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "backlog" | "in_progress" | "review" | "done";

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  order: number;
  updatedAt: number;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Invoice {
  id: string;
  ownerId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: number;
  customer: string;
}

export type ActivityType = "user" | "billing" | "system" | "task";

export interface ActivityLog {
  id: string;
  ownerId: string;
  type: ActivityType;
  message: string;
  createdAt: number;
}

export type SubscriptionStatus = "active" | "trialing" | "canceled" | "past_due";

export interface SubscriptionRow {
  id: string;
  ownerId: string;
  plan: string;
  mrr: number;
  currency: string;
  status: SubscriptionStatus;
  renewsAt: number;
}

export type SaleStage = "lead" | "qualified" | "proposal" | "won" | "lost";

export interface SaleRow {
  id: string;
  ownerId: string;
  name: string;
  amount: number;
  currency: string;
  stage: SaleStage;
  updatedAt: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartSeriesPoint {
  period: string;
  revenue: number;
  mrr: number;
}

export interface ChartSeed {
  revenueSeries: ChartSeriesPoint[];
  channelBars: ChartPoint[];
  planPie: { name: string; value: number }[];
  cohortBars: ChartPoint[];
  funnelBars: ChartPoint[];
  geoBars: ChartPoint[];
  devicePie: { name: string; value: number }[];
}
