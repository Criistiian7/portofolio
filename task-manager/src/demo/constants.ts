import type { User } from "firebase/auth";

/** Current user in Live Demo (matches seeded task ownership). */
export const DEMO_UID = "demo-user-self";

/** Fake owner for tasks assigned to the demo user (non-owner editing). */
export const DEMO_OTHER_OWNER_UID = "demo-owner-jamie";

export const DEMO_CONTACT_ALICE = "demo-contact-alice";
export const DEMO_CONTACT_BOB = "demo-contact-bob";

/** Contacts shown in assignee pickers; includes the fake owner for consistent labels. */
export const DEMO_CONTACT_UIDS = [
  DEMO_CONTACT_ALICE,
  DEMO_CONTACT_BOB,
  DEMO_OTHER_OWNER_UID,
] as const;

export const DEMO_LABELS: Record<string, string> = {
  [DEMO_CONTACT_ALICE]: "Alice Chen",
  [DEMO_CONTACT_BOB]: "Bob Martinez",
  [DEMO_OTHER_OWNER_UID]: "Jamie Rivera",
  [DEMO_UID]: "Demo User",
};

export const DEMO_USER = {
  uid: DEMO_UID,
  email: "demo@example.com",
  displayName: "Demo User",
  photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user",
} as User;
