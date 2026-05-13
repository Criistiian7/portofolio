import { collection, getDocs, query, where, type DocumentData } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { OrgUser, UserRole, UserStatus } from "@/types";
import { mockListOrgUsers } from "@/services/mock/mockData";

function mapOrgUser(id: string, data: DocumentData): OrgUser {
  return {
    id,
    ownerId: String(data.ownerId),
    name: String(data.name),
    email: String(data.email),
    role: (data.role as UserRole) ?? "member",
    status: (data.status as UserStatus) ?? "active",
  };
}

export async function listOrgUsers(ownerId: string): Promise<OrgUser[]> {
  if (isMockMode) {
    return mockListOrgUsers(ownerId);
  }
  const db = getFirestoreDb();
  const q = query(collection(db, "orgUsers"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapOrgUser(d.id, d.data()));
}
