import { describe, expect, it } from "vitest";
import { mergeScore, parseLeaderboard, type LeaderboardEntry } from "./leaderboard";

describe("parseLeaderboard", () => {
  it("supports legacy number arrays", () => {
    const parsed = parseLeaderboard(JSON.stringify([88, 72]));
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.wpm).toBe(88);
    expect(parsed[1]?.name).toBe("Player");
  });

  it("ignores invalid payloads", () => {
    expect(parseLeaderboard("{bad json")).toEqual([]);
    expect(parseLeaderboard(JSON.stringify({ foo: "bar" }))).toEqual([]);
  });
});

describe("mergeScore", () => {
  it("sorts descending and limits to top 10", () => {
    const base: LeaderboardEntry[] = Array.from({ length: 10 }, (_, index) => ({
      name: `P${index}`,
      wpm: 10 + index,
      at: `2026-01-0${(index % 9) + 1}`,
    }));

    const merged = mergeScore(base, {
      name: "Top",
      wpm: 200,
      at: "2026-01-10",
    });

    expect(merged).toHaveLength(10);
    expect(merged[0]?.name).toBe("Top");
  });
});
