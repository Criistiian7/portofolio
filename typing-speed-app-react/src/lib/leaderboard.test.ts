import { describe, it, expect, beforeEach } from "vitest";
import {
  mergeNewEntry,
  parseLeaderboardJson,
  readLeaderboard,
  LEADERBOARD_STORAGE_KEY,
  type LeaderboardEntry,
} from "./leaderboard";

describe("leaderboard storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("parses legacy numeric scores", () => {
    const parsed = parseLeaderboardJson(JSON.stringify([80, 60]));
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.wpm).toBe(80);
    expect(parsed[1]?.wpm).toBe(60);
  });

  it("mergeNewEntry dedupes identical name, wpm, and timestamp", () => {
    const a: LeaderboardEntry = { name: "Ada", wpm: 42, at: 100 };
    const base: LeaderboardEntry[] = [];
    const once = mergeNewEntry(base, a);
    const twice = mergeNewEntry(once, a);
    expect(twice).toHaveLength(1);
  });

  it("readLeaderboard reads from primary key", () => {
    const entries: LeaderboardEntry[] = [
      { name: "Ada", wpm: 90, at: 1 },
    ];
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
    expect(readLeaderboard(localStorage)).toEqual(entries);
  });
});
