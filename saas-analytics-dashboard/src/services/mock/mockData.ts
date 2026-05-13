import type {
  ActivityLog,
  ChartSeed,
  Invoice,
  OrgUser,
  SaleRow,
  SubscriptionRow,
  Task,
  TaskStatus,
} from "@/types";
import chartSeed from "@/data/chart-seed.json";

const MOCK_UID = "mock-user";

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

let tasksSeed: Task[] = [
  {
    id: "t1",
    ownerId: MOCK_UID,
    title: "Ship analytics dashboard",
    description: "Wire charts and tables to Firestore.",
    priority: "high",
    status: "in_progress",
    order: 0,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "t2",
    ownerId: MOCK_UID,
    title: "Draft security rules",
    description: "Owner-scoped reads and writes.",
    priority: "medium",
    status: "backlog",
    order: 1,
    updatedAt: Date.now() - 172800000,
  },
  {
    id: "t3",
    ownerId: MOCK_UID,
    title: "Accessibility pass",
    description: "Focus order and skip link.",
    priority: "low",
    status: "review",
    order: 0,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "t4",
    ownerId: MOCK_UID,
    title: "Write README architecture",
    description: "Explain mock vs Firestore split.",
    priority: "medium",
    status: "done",
    order: 0,
    updatedAt: Date.now() - 7200000,
  },
];

let invoicesSeed: Invoice[] = [
  {
    id: "inv1",
    ownerId: MOCK_UID,
    amount: 1200,
    currency: "EUR",
    status: "paid",
    issuedAt: Date.now() - 5 * 86400000,
    customer: "Northwind Labs",
  },
  {
    id: "inv2",
    ownerId: MOCK_UID,
    amount: 840,
    currency: "EUR",
    status: "sent",
    issuedAt: Date.now() - 2 * 86400000,
    customer: "Blue River GmbH",
  },
  {
    id: "inv3",
    ownerId: MOCK_UID,
    amount: 2400,
    currency: "EUR",
    status: "overdue",
    issuedAt: Date.now() - 20 * 86400000,
    customer: "Atlas Robotics",
  },
];

const activitySeed: ActivityLog[] = [
  {
    id: "a1",
    ownerId: MOCK_UID,
    type: "billing",
    message: "Invoice #1042 marked paid",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "a2",
    ownerId: MOCK_UID,
    type: "user",
    message: "Morgan invited a teammate",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "a3",
    ownerId: MOCK_UID,
    type: "task",
    message: "Task moved to Review",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "a4",
    ownerId: MOCK_UID,
    type: "system",
    message: "Weekly digest sent",
    createdAt: Date.now() - 172800000,
  },
];

const orgUsersSeed: OrgUser[] = [
  {
    id: "ou1",
    ownerId: MOCK_UID,
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "ou2",
    ownerId: MOCK_UID,
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "member",
    status: "active",
  },
  {
    id: "ou3",
    ownerId: MOCK_UID,
    name: "Sam Patel",
    email: "sam@example.com",
    role: "manager",
    status: "invited",
  },
];

const subscriptionsSeed: SubscriptionRow[] = [
  {
    id: "s1",
    ownerId: MOCK_UID,
    plan: "Growth",
    mrr: 499,
    currency: "EUR",
    status: "active",
    renewsAt: Date.now() + 10 * 86400000,
  },
  {
    id: "s2",
    ownerId: MOCK_UID,
    plan: "Starter",
    mrr: 79,
    currency: "EUR",
    status: "trialing",
    renewsAt: Date.now() + 3 * 86400000,
  },
];

const salesSeed: SaleRow[] = [
  {
    id: "sl1",
    ownerId: MOCK_UID,
    name: "Acme Corp expansion",
    amount: 48000,
    currency: "EUR",
    stage: "proposal",
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "sl2",
    ownerId: MOCK_UID,
    name: "Globex pilot",
    amount: 12000,
    currency: "EUR",
    stage: "qualified",
    updatedAt: Date.now() - 172800000,
  },
];

export const mockChartSeed: ChartSeed = chartSeed as ChartSeed;

export function mockListTasks(ownerId: string): Task[] {
  return tasksSeed
    .filter((t) => t.ownerId === ownerId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((t) => ({ ...t }));
}

export function mockUpsertTasks(next: Task[]) {
  tasksSeed = next;
}

/** Replace all tasks belonging to `ownerId` while preserving other owners' rows. */
export function mockSetOwnerTasks(ownerId: string, ownerTasks: Task[]) {
  tasksSeed = [...tasksSeed.filter((t) => t.ownerId !== ownerId), ...ownerTasks];
}

export function mockUpdateTaskOrder(
  ownerId: string,
  updates: { id: string; status: TaskStatus; order: number }[],
) {
  const map = new Map(updates.map((u) => [u.id, u]));
  tasksSeed = tasksSeed.map((t) => {
    const u = map.get(t.id);
    if (!u || t.ownerId !== ownerId) return t;
    return { ...t, status: u.status, order: u.order, updatedAt: Date.now() };
  });
}

export function mockListInvoices(ownerId: string): Invoice[] {
  return clone(invoicesSeed.filter((i) => i.ownerId === ownerId));
}

export function mockListActivity(ownerId: string): ActivityLog[] {
  return clone(activitySeed.filter((a) => a.ownerId === ownerId)).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

export function mockListOrgUsers(ownerId: string): OrgUser[] {
  return clone(orgUsersSeed.filter((u) => u.ownerId === ownerId));
}

export function mockListSubscriptions(ownerId: string): SubscriptionRow[] {
  return clone(subscriptionsSeed.filter((s) => s.ownerId === ownerId));
}

export function mockListSales(ownerId: string): SaleRow[] {
  return clone(salesSeed.filter((s) => s.ownerId === ownerId));
}
