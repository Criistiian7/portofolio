export type LeaderboardDifficulty = "easy" | "medium" | "hard";

export type LeaderboardEntry = {
  name: string;
  wpm: number;
  at: string;
  difficulty: LeaderboardDifficulty;
};

export const LEADERBOARD_STORAGE_KEY = "scores";

const normalizeDifficulty = (value: unknown): LeaderboardDifficulty => {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }
  return "easy";
};

const normalizeEntry = (
  item: LeaderboardEntry | number,
): LeaderboardEntry | null => {
  if (typeof item === "number") {
    return {
      name: "Player",
      wpm: item,
      at: new Date().toISOString(),
      difficulty: "easy",
    };
  }

  if (
    typeof item?.name === "string" &&
    typeof item?.wpm === "number" &&
    typeof item?.at === "string"
  ) {
    return {
      name: item.name,
      wpm: item.wpm,
      at: item.at,
      difficulty: normalizeDifficulty(item.difficulty),
    };
  }

  return null;
};

export const parseLeaderboard = (raw: string | null): LeaderboardEntry[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Array<LeaderboardEntry | number>;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeEntry)
      .filter((entry): entry is LeaderboardEntry => entry !== null)
      .sort((a, b) => b.wpm - a.wpm);
  } catch {
    return [];
  }
};

const TOP_PER_DIFFICULTY = 10;

export const mergeScore = (
  current: LeaderboardEntry[],
  next: LeaderboardEntry,
): LeaderboardEntry[] => {
  const merged = [...current, next];
  const byDiff = new Map<LeaderboardDifficulty, LeaderboardEntry[]>();

  for (const entry of merged) {
    const list = byDiff.get(entry.difficulty) ?? [];
    list.push(entry);
    byDiff.set(entry.difficulty, list);
  }

  const out: LeaderboardEntry[] = [];
  for (const list of byDiff.values()) {
    list.sort((a, b) => b.wpm - a.wpm);
    out.push(...list.slice(0, TOP_PER_DIFFICULTY));
  }

  return out.sort((a, b) => b.wpm - a.wpm);
};
