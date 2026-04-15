const FALLBACK_QUOTES: string[] = [
  "Practice makes perfect.",
  "The quick brown fox jumps over the lazy dog.",
  "Small steps every day add up to big changes.",
  "Readable code is a gift to your future self.",
  "Ship early, iterate often, measure what matters.",
];

export async function fetchQuote(): Promise<string> {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { quote?: string };
    if (typeof data.quote === "string" && data.quote.trim()) {
      return data.quote.trim();
    }
  } catch {
    /* use local fallback */
  }

  const i = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[i]!;
}
