import { useEffect, useState, useCallback, useRef } from "react";
import { fetchQuote } from "../services/api";

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // load quote based on difficulty
  const loadQuote = useCallback(async () => {
    const q = await fetchQuote();

    let modified = q;

    if (difficulty === "easy") {
      modified = q.split(" ").slice(0, 5).join(" ");
    } else if (difficulty === "medium") {
      modified = q.split(" ").slice(0, 10).join(" ");
    } else {
      modified = q;
    }

    setQuote(modified);
  }, [difficulty]);

  useEffect(() => {
    loadQuote();
    reset();
  }, [difficulty, loadQuote]);

  const finishTest = useCallback(() => {
    if (!start) return;

    const elapsed = (60 - time) / 60;
    const words = input.length / 5;
    const wpm = Math.round(words / elapsed);

    onFinish(isNaN(wpm) ? 0 : wpm);
  }, [time, input, start, onFinish]);

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

  // preload sound once
  useEffect(() => {
    audioRef.current = new Audio(
      "https://www.soundjay.com/mechanical/keyboard-1.mp3",
    );
    if (audioRef.current) audioRef.current.volume = 0.1;
  }, []);

  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!start) setStart(new Date());

    playSound();

    const value = e.target.value;
    setInput(value);

    let correct = 0;
    value.split("").forEach((char, i) => {
      if (char === quote[i]) correct++;
    });

    const acc = Math.round((correct / value.length) * 100);
    setAccuracy(isNaN(acc) ? 100 : acc);

    const elapsed =
      (new Date().getTime() - (start?.getTime() || Date.now())) / 60000;

    const words = value.length / 5;
    const wpm = Math.round(words / elapsed);

    setWpm(isNaN(wpm) ? 0 : wpm);
  };

  const progress = quote.length ? (input.length / quote.length) * 100 : 0;

  const reset = () => {
    setInput("");
    setTime(60);
    setStart(null);
    setWpm(0);
    setAccuracy(100);
  };

  return (
    <div className="card typing-box">
      <div className="progress">
        <div style={{ width: `${progress}%` }}></div>
      </div>

      <p className="quote">
        {quote.split("").map((char, i) => {
          let color = "";

          if (i < input.length) {
            color = input[i] === char ? "#22c55e" : "#ef4444";
          }

          return (
            <span key={i} style={{ color }}>
              {char}
            </span>
          );
        })}
      </p>

      <textarea value={input} onChange={handleChange} />

      <button onClick={reset}>Reset</button>

      <p className="timer">Time: {time}s</p>
    </div>
  );
}
