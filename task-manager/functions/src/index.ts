import { initializeApp } from "firebase-admin/app";
import {
  FieldValue,
  getFirestore,
  type DocumentSnapshot,
  type WriteBatch,
} from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();
const db = getFirestore();

const normalizeEmail = (value: string) => value.trim().toLowerCase();

async function sendInviteEmail(params: {
  toEmail: string;
  inviteId: string;
  fromUid: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INVITE_FROM_EMAIL?.trim();
  const appUrl = process.env.APP_PUBLIC_URL?.trim() ?? "http://localhost:5173";

  if (!apiKey || !from) {
    console.info(
      "[createInvite] Email skipped (set RESEND_API_KEY and INVITE_FROM_EMAIL to enable).",
      params,
    );
    return;
  }

  const link = `${appUrl.replace(/\/$/, "")}/?invite=${encodeURIComponent(params.inviteId)}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.toEmail],
      subject: "You have been invited to collaborate on Task Manager",
      html: `<p>You were invited to collaborate.</p><p><a href="${link}">Open the app</a> and sign in with this email to connect your workspace.</p>`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[createInvite] Resend error", response.status, text);
  }
}

export const createInvite = onCall(
  { region: "us-central1", cors: true },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Sign in before sending invites.");
    }

    const raw = request.data?.toEmail;
    if (typeof raw !== "string" || !raw.trim()) {
      throw new HttpsError("invalid-argument", "Provide a valid email address.");
    }

    const toEmail = normalizeEmail(raw);
    const fromUid = request.auth.uid;
    const selfEmail = request.auth.token.email
      ? normalizeEmail(request.auth.token.email)
      : "";

    if (selfEmail && toEmail === selfEmail) {
      throw new HttpsError("invalid-argument", "You cannot invite your own email.");
    }

    const inviteRef = db.collection("invites").doc();
    await inviteRef.set({
      fromUid,
      toEmail,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    await sendInviteEmail({ toEmail, inviteId: inviteRef.id, fromUid });

    return { inviteId: inviteRef.id };
  },
);

function applyAcceptedInviteBatch(
  batch: WriteBatch,
  docSnap: DocumentSnapshot,
  uid: string,
) {
  if (!docSnap.exists) {
    return false;
  }

  const inviterUid = docSnap.data()?.fromUid;
  if (typeof inviterUid !== "string" || !inviterUid) {
    return false;
  }

  batch.update(docSnap.ref, {
    status: "accepted",
    acceptedAt: FieldValue.serverTimestamp(),
  });

  batch.set(
    db.collection("users").doc(uid),
    { contacts: FieldValue.arrayUnion(inviterUid) },
    { merge: true },
  );

  batch.set(
    db.collection("users").doc(inviterUid),
    { contacts: FieldValue.arrayUnion(uid) },
    { merge: true },
  );

  return true;
}

export const acceptInvite = onCall(
  { region: "us-central1", cors: true },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Sign in before accepting invites.");
    }

    const emailRaw = request.auth.token.email;
    if (typeof emailRaw !== "string" || !emailRaw.trim()) {
      throw new HttpsError(
        "failed-precondition",
        "Your account must have an email address to accept invites.",
      );
    }

    const email = normalizeEmail(emailRaw);
    const uid = request.auth.uid;

    const inviteIdRaw = request.data?.inviteId;
    const inviteId =
      typeof inviteIdRaw === "string" && inviteIdRaw.trim() ? inviteIdRaw.trim() : null;

    if (inviteId) {
      const docRef = db.collection("invites").doc(inviteId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return { accepted: 0 };
      }

      const data = docSnap.data();
      if (
        data?.toEmail !== email ||
        data?.status !== "pending" ||
        typeof data?.fromUid !== "string" ||
        !data.fromUid
      ) {
        return { accepted: 0 };
      }

      const batch = db.batch();
      const ok = applyAcceptedInviteBatch(batch, docSnap, uid);
      if (!ok) {
        return { accepted: 0 };
      }

      await batch.commit();
      return { accepted: 1 };
    }

    const pending = await db
      .collection("invites")
      .where("toEmail", "==", email)
      .where("status", "==", "pending")
      .get();

    if (pending.empty) {
      return { accepted: 0 };
    }

    const batch = db.batch();
    let acceptedCount = 0;

    for (const docSnap of pending.docs) {
      if (applyAcceptedInviteBatch(batch, docSnap, uid)) {
        acceptedCount += 1;
      }
    }

    if (acceptedCount === 0) {
      return { accepted: 0 };
    }

    await batch.commit();

    return { accepted: acceptedCount };
  },
);

export const declineInvite = onCall(
  { region: "us-central1", cors: true },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Sign in before declining invites.");
    }

    const emailRaw = request.auth.token.email;
    if (typeof emailRaw !== "string" || !emailRaw.trim()) {
      throw new HttpsError(
        "failed-precondition",
        "Your account must have an email address to decline invites.",
      );
    }

    const email = normalizeEmail(emailRaw);

    const rawId = request.data?.inviteId;
    if (typeof rawId !== "string" || !rawId.trim()) {
      throw new HttpsError("invalid-argument", "Provide inviteId.");
    }

    const inviteRef = db.collection("invites").doc(rawId.trim());
    const snap = await inviteRef.get();

    if (!snap.exists) {
      throw new HttpsError("not-found", "Invite not found.");
    }

    const data = snap.data();
    if (data?.toEmail !== email || data?.status !== "pending") {
      throw new HttpsError("failed-precondition", "This invite cannot be declined.");
    }

    await inviteRef.update({
      status: "declined",
      declinedAt: FieldValue.serverTimestamp(),
    });

    return { ok: true };
  },
);
