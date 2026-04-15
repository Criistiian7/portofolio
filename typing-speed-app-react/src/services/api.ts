export const fetchQuote = async (): Promise<string> => {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    return data.content;
  } catch {
    return "Practice makes perfect.";
  }
};
