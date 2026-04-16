const FALLBACK_QUOTES = [
  "Practice makes progress, not perfection.",
  "Small consistent wins build real typing speed.",
  "Focus on accuracy first and pace follows naturally.",
  "Reliable habits outperform bursts of motivation.",
];

async function fetchQuoteFromNetwork(): Promise<string> {
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
}

let prefetchedQuote: Promise<string> | null = null;

/**
 * Warms the network/cache for the next quote while the user finishes the current one.
 */
export function prefetchNextQuote(): void {
  if (!prefetchedQuote) {
    prefetchedQuote = fetchQuoteFromNetwork();
  }
}

/**
 * Drops any in-flight prefetch (e.g. difficulty change) so the next load is fresh.
 */
export function clearQuotePrefetch(): void {
  prefetchedQuote = null;
}

/**
 * Returns the prefetched quote if available, otherwise fetches. Single call consumes prefetch.
 */
export async function consumeQuoteOrFetch(): Promise<string> {
  if (prefetchedQuote) {
    const pending = prefetchedQuote;
    prefetchedQuote = null;
    return pending;
  }
  return fetchQuoteFromNetwork();
}

export const fetchQuote = async (): Promise<string> => {
  return fetchQuoteFromNetwork();
};
