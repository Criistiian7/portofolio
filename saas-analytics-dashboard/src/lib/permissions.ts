import type { UserRole } from "@/types";

export function canManageBilling(role: UserRole | undefined): boolean {
  return role === "admin" || role === "billing";
}

export function canInviteUsers(role: UserRole | undefined): boolean {
  return role === "admin" || role === "manager";
}

export function isAdmin(role: UserRole | undefined): boolean {
  return role === "admin";
}
