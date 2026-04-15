import { useEffect, useState, useCallback, useRef } from "react";
import { fetchQuote } from "../services/api";
import { computeStats } from "../utils/stats";

type Props = {
  difficulty: string;
  onFinish: (wpm: number) => void;
  setWpm: (wpm: number) => void;
  setRawWpm: (wpm: number) => void;
  setAccuracy: (acc: number) => void;
};

const TIMER_OPTIONS = [15, 30, 60];

export default function TypingBox({
  difficulty,
  onFinish,
  setWpm,
  setRawWpm,
  setAccuracy,
}: Props) {
  const [quote, setQuote] = useState("");
  const [input, setInput] = useState("");
  const [duration, setDuration] = useState(60);
  const [time, setTime] = useState(60);
  const [startMs, setStartMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const latestInputRef = useRef("");

  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    const q = await fetchQuote();

    if (!q) {
      setQuote("");
      setLoadError("Could not load quote. Try again.");
      setIsLoading(false);
      return;
    }

    let modified = q;

    if (difficulty === "easy") {
      modified = q.split(" ").slice(0, 5).join(" ");
    } else if (difficulty === "medium") {
      modified = q.split(" ").slice(0, 10).join(" ");
    } else {
      modified = q;
    }

    setQuote(modified);
    setIsLoading(false);
  }, [difficulty]);

  const reset = useCallback(() => {
    setInput("");
    latestInputRef.current = "";
    setTime(duration);
    setStartMs(null);
    setIsFinished(false);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  }, [duration, setWpm, setRawWpm, setAccuracy]);

  useEffect(() => {
    loadQuote();
    reset();
  }, [difficulty, loadQuote, reset]);

  useEffect(() => {
    setTime(duration);
  }, [duration]);

  const finishTest = useCallback(
    (finalInput: string, endedAt: number, startedAt: number | null) => {
      if (isFinished) return;

      const stats = computeStats(quote, finalInput, startedAt, endedAt);
      setWpm(stats.wpm);
      setRawWpm(stats.rawWpm);
      setAccuracy(stats.accuracy);
      setIsFinished(true);
      onFinish(stats.wpm);
    },
    [isFinished, quote, setWpm, setRawWpm, setAccuracy, onFinish],
  );

  useEffect(() => {
    if (!startMs || isFinished) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          finishTest(latestInputRef.current, Date.now(), startMs);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startMs, finishTest, isFinished]);

  useEffect(() => {
    audioRef.current = new Audio("/typing.wav");
    if (audioRef.current) audioRef.current.volume = 0.1;
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const playSound = () => {
    if (!audioRef.current || !soundOn) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || isLoading) return;
    const now = Date.now();
    const nextStart = startMs ?? now;

    if (!startMs) setStartMs(now);

    playSound();

    const value = e.target.value;
    setInput(value);
    latestInputRef.current = value;

    const stats = computeStats(quote, value, nextStart, now);
    setAccuracy(stats.accuracy);
    setWpm(stats.wpm);
    setRawWpm(stats.rawWpm);

    if (value.length >= quote.length) {
      finishTest(value, now, nextStart);
    }
  };

  const progress = quote.length ? (input.length / quote.length) * 100 : 0;

  return (
    <div className="card typing-box">
      <div className="typing-controls">
        <div className="timer-presets" role="group" aria-label="Timer duration">
          {TIMER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`segment ${duration === option ? "active" : ""}`}
              onClick={() => {
                setDuration(option);
                setTime(option);
                setStartMs(null);
                setIsFinished(false);
                setInput("");
                setWpm(0);
                setRawWpm(0);
                setAccuracy(100);
              }}
              aria-pressed={duration === option}
            >
              {option}s
            </button>
          ))}
        </div>

        <button type="button" className="ghost-btn" onClick={() => setSoundOn((prev) => !prev)}>
          Sound: {soundOn ? "On" : "Off"}
        </button>
      </div>

      <div className="progress">
        <div style={{ width: `${progress}%` }} aria-hidden="true"></div>
      </div>

      {isLoading ? (
        <p className="quote">Loading quote...</p>
      ) : loadError ? (
        <div className="load-error">
          <p>{loadError}</p>
          <button type="button" onClick={loadQuote}>
            Retry
          </button>
        </div>
      ) : (
        <p className="quote">
          {quote.split("").map((char, i) => {
            let className = "";
            if (i < input.length) {
              className = input[i] === char ? "ok" : "err";
            }

            return (
              <span key={i} className={className}>
                {char}
              </span>
            );
          })}
        </p>
      )}

      <label htmlFor="typing-input" className="sr-only">
        Typing input area
      </label>
      <textarea
        id="typing-input"
        ref={inputRef}
        value={input}
        onChange={handleChange}
        placeholder="Start typing the text above..."
        disabled={isLoading || !!loadError || isFinished}
        aria-label="Typing input area"
      />

      <div className="typing-actions">
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button type="button" onClick={loadQuote}>
          New quote
        </button>
      </div>

      <p className="timer">Time: {time}s</p>
      <p className="sr-only" aria-live="polite">
        {isFinished ? "Test finished." : "Test in progress."}
      </p>
    </div>
  );
}
