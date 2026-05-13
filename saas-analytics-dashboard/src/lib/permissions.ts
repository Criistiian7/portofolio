import type { UserRole } from "@/types";

/**
 * MetricFlow V2 nav: `canManageBilling` gates subscriptions + invoices; `canInviteUsers` gates customers + team.
 * Other app routes are intentionally visible to every authenticated role in this portfolio slice.
 */

export function canManageBilling(role: UserRole | undefined): boolean {
  return role === "admin" || role === "billing";
}

export function canInviteUsers(role: UserRole | undefined): boolean {
  return role === "admin" || role === "manager";
}

export function isAdmin(role: UserRole | undefined): boolean {
  return role === "admin";
}
