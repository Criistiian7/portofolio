import { useEffect, useState, useCallback } from "react";
import { easyQuotes, mediumQuotes, hardQuotes } from "../utils/quotes";

type Props = {
  difficulty: string;
  onFinish: (wpm: number) => void;
  setWpm: (wpm: number) => void;
  setAccuracy: (acc: number) => void;
};

export default function TypingBox({
  difficulty,
  onFinish,
  setWpm,
  setAccuracy,
}: Props) {
  const [quote, setQuote] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [time, setTime] = useState<number>(60);
  const [start, setStart] = useState<Date | null>(null);

  const getQuotesByDifficulty = () => {
    if (difficulty === "easy") return easyQuotes;
    if (difficulty === "medium") return mediumQuotes;
    return hardQuotes;
  };

  // 🔹 set quote
  useEffect(() => {
    const selectedQuotes = getQuotesByDifficulty();
    const random =
      selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];

    setQuote(random);
    setInput("");
    setTime(60);
    setStart(null);
  }, [difficulty]);

  const finishTest = useCallback(() => {
    if (!start) return;

    const elapsed = (60 - time) / 60;
    const words = input.length / 5;
    const wpm = Math.round(words / elapsed);

    onFinish(isNaN(wpm) ? 0 : wpm);
  }, [time, input, start, onFinish]);

  // 🔹 timer
  useEffect(() => {
    if (!start) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          finishTest();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [start, finishTest]);

  // 🔹 typing logic
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!start) setStart(new Date());

    const value = e.target.value;
    setInput(value);

    // accuracy
    let correct = 0;

    value.split("").forEach((char, i) => {
      if (char === quote[i]) correct++;
    });

    const acc = Math.round((correct / value.length) * 100);
    setAccuracy(isNaN(acc) ? 100 : acc);

    // WPM live
    const elapsed =
      (new Date().getTime() - (start?.getTime() || Date.now())) / 60000;

    const words = value.length / 5;
    const wpm = Math.round(words / elapsed);

    setWpm(isNaN(wpm) ? 0 : wpm);
  };

  return (
    <div>
      {/* 🔥 highlight */}
      <p>
        {quote.split("").map((char, i) => {
          let color = "";

          if (i < input.length) {
            color = input[i] === char ? "green" : "red";
          }

          return (
            <span key={i} style={{ color }}>
              {char}
            </span>
          );
        })}
      </p>

      <textarea value={input} onChange={handleChange} />

      <p>Time: {time}</p>
    </div>
  );
}
