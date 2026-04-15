import { describe, expect, it } from "vitest";
import { computeStats, countCorrectChars } from "./stats";

describe("countCorrectChars", () => {
  it("counts only index-matching characters", () => {
    expect(countCorrectChars("abcde", "abXde")).toBe(4);
  });
});

describe("computeStats", () => {
  it("returns wpm and rawWpm as zero before start", () => {
    const result = computeStats("hello", "he", null, 2000);

    expect(result.wpm).toBe(0);
    expect(result.rawWpm).toBe(0);
    expect(result.accuracy).toBe(100);
  });

  it("computes accuracy, net wpm and raw wpm", () => {
    const result = computeStats("hello world", "hello worlx", 0, 60_000);

    expect(result.correctChars).toBe(10);
    expect(result.totalTypedChars).toBe(11);
    expect(result.accuracy).toBe(91);
    expect(result.wpm).toBe(2);
    expect(result.rawWpm).toBe(2);
  });
});
