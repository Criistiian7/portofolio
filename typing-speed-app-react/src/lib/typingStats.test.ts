import { describe, it, expect } from "vitest";
import { computeTypingStats } from "./typingStats";

describe("computeTypingStats", () => {
  it("returns zeros when typing has not started", () => {
    const r = computeTypingStats({
      quote: "hello",
      input: "",
      startedAtMs: null,
      nowMs: 1_000,
    });
    expect(r.wpm).toBe(0);
    expect(r.accuracy).toBe(100);
  });

  it("computes accuracy from correct keystrokes", () => {
    const start = 10_000;
    const now = 70_000;
    const r = computeTypingStats({
      quote: "ab",
      input: "ax",
      startedAtMs: start,
      nowMs: now,
    });
    expect(r.correctChars).toBe(1);
    expect(r.totalTyped).toBe(2);
    expect(r.accuracy).toBe(50);
  });

  it("uses net WPM from correct characters and elapsed time", () => {
    const start = 0;
    const now = 60_000;
    const r = computeTypingStats({
      quote: "hello world",
      input: "hello world",
      startedAtMs: start,
      nowMs: now,
    });
    const correct = 11;
    const words = correct / 5;
    expect(r.wpm).toBe(Math.round(words / 1));
  });
});
