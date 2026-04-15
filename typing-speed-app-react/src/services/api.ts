export const fetchQuote = async (): Promise<string> => {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();
    return data.quote;
  } catch {
    return "Practice makes perfect.";
  }
};
