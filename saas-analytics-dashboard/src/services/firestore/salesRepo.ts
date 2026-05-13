import { collection, getDocs, query, where, type DocumentData } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { SaleRow, SaleStage } from "@/types";
import { mockListSales } from "@/services/mock/mockData";

function mapSale(id: string, data: DocumentData): SaleRow {
  return {
    id,
    ownerId: String(data.ownerId),
    name: String(data.name),
    amount: Number(data.amount),
    currency: String(data.currency ?? "USD"),
    stage: (data.stage as SaleStage) ?? "lead",
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

export async function listSales(ownerId: string): Promise<SaleRow[]> {
  if (isMockMode) {
    return mockListSales(ownerId);
  }
  const db = getFirestoreDb();
  const q = query(collection(db, "sales"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapSale(d.id, d.data())).sort((a, b) => b.updatedAt - a.updatedAt);
}
