import { localDateIso } from "../lib/dates";
import type { Task } from "../types/Task";
import {
  DEMO_CONTACT_ALICE,
  DEMO_CONTACT_BOB,
  DEMO_OTHER_OWNER_UID,
  DEMO_UID,
} from "./constants";

function normalizeParticipantIds(
  ownerId: string,
  assigneeUid: string | null,
): string[] {
  const merged = new Set<string>([ownerId]);
  if (assigneeUid) merged.add(assigneeUid);
  return Array.from(merged);
}

const isoDaysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

/**
 * Sample tasks for Live Demo. Uses the viewer's local calendar for “due today”.
 */
export function createDemoTasks(): Task[] {
  const today = localDateIso();
  const future = new Date();
  future.setDate(future.getDate() + 14);
  const futureDue = localDateIso(future);

  const created = isoDaysAgo(10);
  const updated = isoDaysAgo(1);

  const tasks: Task[] = [
    {
      id: "demo-task-1",
      text: "Review sprint backlog",
      description: "Triage stories and update estimates before planning.",
      priority: "medium",
      dueDate: today,
      project: "Work",
      ownerId: DEMO_UID,
      status: "todo",
      participantIds: normalizeParticipantIds(DEMO_UID, null),
      assigneeUid: null,
      assigneeDisplayName: null,
      assigneePhotoURL: null,
      createdAt: created,
      updatedAt: updated,
    },
    {
      id: "demo-task-2",
      text: "Prototype dashboard cards",
      description: "Explore layout for metrics and filters.",
      priority: "high",
      dueDate: futureDue,
      project: "Design",
      ownerId: DEMO_UID,
      status: "in_progress",
      participantIds: normalizeParticipantIds(DEMO_UID, DEMO_CONTACT_ALICE),
      assigneeUid: DEMO_CONTACT_ALICE,
      assigneeDisplayName: "Alice Chen",
      assigneePhotoURL:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      createdAt: created,
      updatedAt: updated,
    },
    {
      id: "demo-task-3",
      text: "Weekly grocery run",
      description: "",
      priority: "low",
      dueDate: null,
      project: "Personal",
      ownerId: DEMO_UID,
      status: "done",
      participantIds: normalizeParticipantIds(DEMO_UID, null),
      assigneeUid: null,
      assigneeDisplayName: null,
      assigneePhotoURL: null,
      createdAt: isoDaysAgo(20),
      updatedAt: isoDaysAgo(2),
    },
    {
      id: "demo-task-4",
      text: "Reply to support threads",
      description: "Clear Inbox items flagged as waiting.",
      priority: "low",
      dueDate: futureDue,
      project: "Inbox",
      ownerId: DEMO_UID,
      status: "todo",
      participantIds: normalizeParticipantIds(DEMO_UID, DEMO_CONTACT_BOB),
      assigneeUid: DEMO_CONTACT_BOB,
      assigneeDisplayName: "Bob Martinez",
      assigneePhotoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      createdAt: created,
      updatedAt: updated,
    },
    {
      id: "demo-task-5",
      text: "Document API error codes",
      description: "Jamie owns this; you are the assignee — project/assignee stay locked.",
      priority: "medium",
      dueDate: today,
      project: "General",
      ownerId: DEMO_OTHER_OWNER_UID,
      status: "todo",
      participantIds: normalizeParticipantIds(DEMO_OTHER_OWNER_UID, DEMO_UID),
      assigneeUid: DEMO_UID,
      assigneeDisplayName: "Demo User",
      assigneePhotoURL:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user",
      createdAt: created,
      updatedAt: updated,
    },
    {
      id: "demo-task-6",
      text: "Fix flaky integration test",
      description: "Non-owner task: you can edit details but not project or assignee.",
      priority: "high",
      dueDate: null,
      project: "Work",
      ownerId: DEMO_OTHER_OWNER_UID,
      status: "in_progress",
      participantIds: normalizeParticipantIds(DEMO_OTHER_OWNER_UID, DEMO_UID),
      assigneeUid: DEMO_UID,
      assigneeDisplayName: "Demo User",
      assigneePhotoURL:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user",
      createdAt: isoDaysAgo(5),
      updatedAt: updated,
    },
  ];

  return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
