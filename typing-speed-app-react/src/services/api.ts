const FALLBACK_QUOTES = [
  "Practice makes progress, not perfection.",
  "Small consistent wins build real typing speed.",
  "Focus on accuracy first and pace follows naturally.",
  "Reliable habits outperform bursts of motivation.",
];

export const fetchQuote = async (): Promise<string> => {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) {
      throw new Error("Quote request failed");
    }

    const data = await res.json();

    if (typeof data?.quote !== "string" || data.quote.trim().length === 0) {
      throw new Error("Missing quote");
    }

    return data.quote;
  } catch {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
};
