export type LeaderboardEntry = {
  name: string;
  wpm: number;
  at: string;
};

export const LEADERBOARD_STORAGE_KEY = "scores";

const normalizeEntry = (
  item: LeaderboardEntry | number,
): LeaderboardEntry | null => {
  if (typeof item === "number") {
    return {
      name: "Player",
      wpm: item,
      at: new Date().toISOString(),
    };
  }

  if (
    typeof item?.name === "string" &&
    typeof item?.wpm === "number" &&
    typeof item?.at === "string"
  ) {
    return item;
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
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);
  } catch {
    return [];
  }
};

export const mergeScore = (
  current: LeaderboardEntry[],
  next: LeaderboardEntry,
): LeaderboardEntry[] =>
  [...current, next].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
