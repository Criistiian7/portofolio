import { collection, getDocs, query, where, type DocumentData } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isMockMode } from "@/env";
import type { Invoice, InvoiceStatus } from "@/types";
import { mockListInvoices } from "@/services/mock/mockData";

function mapInvoice(id: string, data: DocumentData): Invoice {
  return {
    id,
    ownerId: String(data.ownerId),
    amount: Number(data.amount),
    currency: String(data.currency ?? "USD"),
    status: (data.status as InvoiceStatus) ?? "draft",
    issuedAt: Number(data.issuedAt ?? 0),
    customer: String(data.customer ?? ""),
  };
}

export async function listInvoices(ownerId: string): Promise<Invoice[]> {
  if (isMockMode) {
    return mockListInvoices(ownerId);
  }
  const db = getFirestoreDb();
  const q = query(collection(db, "invoices"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapInvoice(d.id, d.data())).sort((a, b) => b.issuedAt - a.issuedAt);
}
