import { collection, getDocs, limit, query, where, type DocumentData } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { ActivityLog, ActivityType } from "@/types";
import { mockListActivity } from "@/services/mock/mockData";

function mapActivity(id: string, data: DocumentData): ActivityLog {
  return {
    id,
    ownerId: String(data.ownerId),
    type: (data.type as ActivityType) ?? "system",
    message: String(data.message ?? ""),
    createdAt: Number(data.createdAt ?? 0),
  };
}

export async function listActivity(ownerId: string, max = 50): Promise<ActivityLog[]> {
  if (isMockMode) {
    return mockListActivity(ownerId).slice(0, max);
  }
  const db = getFirestoreDb();
  const q = query(
    collection(db, "activity"),
    where("ownerId", "==", ownerId),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapActivity(d.id, d.data())).sort((a, b) => b.createdAt - a.createdAt);
}
