export type LeaderboardEntry = {
  name: string;
  wpm: number;
  at: number;
};

export const LEADERBOARD_STORAGE_KEY = "typing-app-leaderboard";
/** Legacy key from earlier versions (number[] WPM only). */
const LEGACY_SCORES_KEY = "scores";

function isEntry(x: unknown): x is LeaderboardEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    typeof o.wpm === "number" &&
    typeof o.at === "number"
  );
}

/** Parses stored JSON; migrates legacy number[] scores to entries. */
export function parseLeaderboardJson(raw: string | null): LeaderboardEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    if (typeof parsed[0] === "number") {
      const now = Date.now();
      return (parsed as number[]).map((wpm, i) => ({
        name: "Player",
        wpm,
        at: now - i,
      }));
    }

    return parsed.filter(isEntry);
  } catch {
    return [];
  }
}

export function readLeaderboard(storage: Storage): LeaderboardEntry[] {
  const primary = parseLeaderboardJson(
    storage.getItem(LEADERBOARD_STORAGE_KEY),
  );
  if (primary.length > 0) return primary;

  const legacy = parseLeaderboardJson(storage.getItem(LEGACY_SCORES_KEY));
  if (legacy.length > 0) {
    storage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(legacy));
  }
  return legacy;
}

export function mergeNewEntry(
  current: LeaderboardEntry[],
  entry: LeaderboardEntry,
  maxEntries = 10,
): LeaderboardEntry[] {
  const isDup = current.some(
    (e) =>
      e.name === entry.name && e.wpm === entry.wpm && e.at === entry.at,
  );
  if (isDup) return current;

  return [...current, entry]
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, maxEntries);
}
