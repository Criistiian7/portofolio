/**
 * Net WPM uses the standard “5 characters = 1 word” convention on **correct**
 * characters only. Accuracy is correct keystrokes / total keystrokes.
 */
export type TypingStatsInput = {
  quote: string;
  input: string;
  startedAtMs: number | null;
  nowMs: number;
};

export type TypingStats = {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalTyped: number;
  elapsedMs: number;
};

const MIN_ELAPSED_MS = 1;

export function computeTypingStats({
  quote,
  input,
  startedAtMs,
  nowMs,
}: TypingStatsInput): TypingStats {
  if (!startedAtMs) {
    return {
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      totalTyped: 0,
      elapsedMs: 0,
    };
  }

  let correctChars = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === quote[i]) correctChars++;
  }

  const totalTyped = input.length;
  const elapsedMs = Math.max(MIN_ELAPSED_MS, nowMs - startedAtMs);
  const accuracy =
    totalTyped === 0
      ? 100
      : Math.round((correctChars / totalTyped) * 100);

  const wordEquivalents = correctChars / 5;
  const minutes = elapsedMs / 60_000;
  const wpm = Math.round(wordEquivalents / minutes);

  return {
    wpm: Number.isFinite(wpm) ? wpm : 0,
    accuracy: Number.isFinite(accuracy) ? accuracy : 100,
    correctChars,
    totalTyped,
    elapsedMs,
  };
}
