export type TypingStats = {
  correctChars: number;
  totalTypedChars: number;
  accuracy: number;
  wpm: number;
  rawWpm: number;
};

const MINUTES_PER_MILLISECOND = 1 / 60000;

export const countCorrectChars = (quote: string, input: string): number => {
  let correct = 0;
  const maxLength = Math.min(quote.length, input.length);

  for (let i = 0; i < maxLength; i += 1) {
    if (quote[i] === input[i]) {
      correct += 1;
    }
  }

  return correct;
};

export const computeStats = (
  quote: string,
  input: string,
  startedAt: number | null,
  endedAt: number,
): TypingStats => {
  const correctChars = countCorrectChars(quote, input);
  const totalTypedChars = input.length;

  const accuracy =
    totalTypedChars === 0
      ? 100
      : Math.round((correctChars / totalTypedChars) * 100);

  if (startedAt === null) {
    return {
      correctChars,
      totalTypedChars,
      accuracy,
      wpm: 0,
      rawWpm: 0,
    };
  }

  const elapsedMs = Math.max(endedAt - startedAt, 1);
  const elapsedMinutes = elapsedMs * MINUTES_PER_MILLISECOND;

  const wpm = Math.round(correctChars / 5 / elapsedMinutes);
  const rawWpm = Math.round(totalTypedChars / 5 / elapsedMinutes);

  return {
    correctChars,
    totalTypedChars,
    accuracy,
    wpm: Number.isFinite(wpm) ? wpm : 0,
    rawWpm: Number.isFinite(rawWpm) ? rawWpm : 0,
  };
};
