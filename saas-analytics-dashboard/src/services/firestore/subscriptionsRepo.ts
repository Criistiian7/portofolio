import { collection, getDocs, query, where, type DocumentData } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { SubscriptionRow, SubscriptionStatus } from "@/types";
import { mockListSubscriptions } from "@/services/mock/mockData";

function mapSub(id: string, data: DocumentData): SubscriptionRow {
  return {
    id,
    ownerId: String(data.ownerId),
    plan: String(data.plan),
    mrr: Number(data.mrr),
    currency: String(data.currency ?? "USD"),
    status: (data.status as SubscriptionStatus) ?? "active",
    renewsAt: Number(data.renewsAt ?? 0),
  };
}

export async function listSubscriptions(ownerId: string): Promise<SubscriptionRow[]> {
  if (isMockMode) {
    return mockListSubscriptions(ownerId);
  }
  const db = getFirestoreDb();
  const q = query(collection(db, "subscriptions"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapSub(d.id, d.data()));
}
