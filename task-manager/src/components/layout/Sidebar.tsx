import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import TaskForm, { PROJECT_OPTIONS } from "../TaskForm";
import { useTasks } from "../../context/useTasks";
import { createInvite } from "../../lib/invites";
import { useContacts } from "../../hooks/useContacts";
import { useInvites } from "../../hooks/useInvites";
import { useProfileLabels } from "../../hooks/useProfileLabels";
import InvitesPanel from "./InvitesPanel";

const NAV_LINKS: { label: string; project: string | null }[] = [
  { label: "Dashboard", project: null },
  { label: "Inbox", project: "Inbox" },
  { label: "Design", project: "Design" },
  { label: "Work", project: "Work" },
  { label: "Personal", project: "Personal" },
];

type Props = {
  userId: string;
  userEmail: string | null;
  projectFilter: string | null;
  onProjectFilterChange: (project: string | null) => void;
};

export default function Sidebar({
  userId,
  userEmail,
  projectFilter,
  onProjectFilterChange,
}: Props) {
  const { addTask, isCreating } = useTasks();
  const contactUids = useContacts(userId);
  const { labelFor } = useProfileLabels(contactUids);
  const invites = useInvites(userEmail, userId);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [invitePending, setInvitePending] = useState(false);

  const sendInvite = async () => {
    const trimmed = inviteEmail.trim();
    if (!trimmed) {
      setInviteMessage("Enter an email address.");
      return;
    }

    setInvitePending(true);
    setInviteMessage(null);

    try {
      await createInvite(trimmed);
      setInviteMessage("Invite sent. They can sign in with that email to connect.");
      setInviteEmail("");
    } catch (error) {
      setInviteMessage(
        error instanceof Error ? error.message : "Could not send invite.",
      );
    } finally {
      setInvitePending(false);
    }
  };

  return (
    <aside className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
          Create New Task
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Ship the next milestone
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Tasks are shared with participants. Assignees you have invited and
          accepted will appear here.
        </p>
      </div>

      <TaskForm
        submitLabel="Add task"
        onSubmit={addTask}
        disabled={isCreating}
        contactUids={contactUids}
        contactLabel={labelFor}
      />

      <div className="border-t border-white/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Invite by email
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="colleague@example.com"
            className="w-full flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400"
          />
          <button
            type="button"
            disabled={invitePending}
            onClick={() => void sendInvite()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            <FaPaperPlane />
            Send
          </button>
        </div>
        {inviteMessage ? (
          <p className="mt-3 text-sm text-slate-300">{inviteMessage}</p>
        ) : null}

        <InvitesPanel
          received={invites.received}
          sent={invites.sent}
          loading={invites.loading}
          error={invites.error}
        />
      </div>

      <nav className="border-t border-white/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Workspace
        </p>
        <ul className="mt-4 space-y-2">
          {NAV_LINKS.map((item) => {
            const active =
              item.project === null
                ? projectFilter === null
                : projectFilter === item.project;

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => onProjectFilterChange(item.project)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.project &&
                  (PROJECT_OPTIONS as readonly string[]).includes(item.project) ? (
                    <span className="text-xs text-slate-500">{item.project}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
