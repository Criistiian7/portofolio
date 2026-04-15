import { useEffect, useState } from "react";
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
  const [quote, setQuote] = useState("");
  const [input, setInput] = useState("");
  const [time, setTime] = useState(60);
  const [start, setStart] = useState<Date | null>(null);

  useEffect(() => {
    let selected;

    if (difficulty === "easy") selected = easyQuotes;
    if (difficulty === "medium") selected = mediumQuotes;
    if (difficulty === "hard") selected = hardQuotes;

    const random = selected[Math.floor(Math.random() * selected.length)];
    setQuote(random);
  }, [difficulty]);

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
  }, [start]);

  const finishTest = () => {
    const elapsed = (60 - time) / 60;
    const words = input.length / 5;
    const wpm = Math.round(words / elapsed);

    onFinish(wpm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!start) setStart(new Date());

    const value = e.target.value;
    setInput(value);

    // Accuracy
    let correct = 0;
    value.split("").forEach((char, i) => {
      if (char === quote[i]) correct++;
    });

    const acc = Math.round((correct / value.length) * 100);
    setAccuracy(isNaN(acc) ? 100 : acc);

    // WPM live
    const elapsed = (new Date().getTime() - (start?.getTime() || 0)) / 60000;
    const words = value.length / 5;
    const wpm = Math.round(words / elapsed);

    setWpm(isNaN(wpm) ? 0 : wpm);
  };

  return (
    <div>
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
