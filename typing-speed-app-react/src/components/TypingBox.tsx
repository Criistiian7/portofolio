import { useEffect, useState, useCallback, useRef } from "react";
import {
  clearQuotePrefetch,
  consumeQuoteOrFetch,
  prefetchNextQuote,
} from "../services/api";
import { computeStats } from "../utils/stats";

const SOUND_STORAGE_KEY = "typingSoundOn";

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
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem(SOUND_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [isFinished, setIsFinished] = useState(false);
  const [roundAnnouncement, setRoundAnnouncement] = useState("");
  const [roundFlash, setRoundFlash] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const latestInputRef = useRef("");
  const segmentStartMsRef = useRef<number | null>(null);
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(soundOn));
    } catch {
      /* ignore quota / private mode */
    }
  }, [soundOn]);

  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    const q = await consumeQuoteOrFetch();

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
    setRoundAnnouncement("");
    setIsLoading(false);
    queueMicrotask(() => {
      inputRef.current?.focus();
    });
  }, [difficulty]);

  const reset = useCallback(() => {
    setInput("");
    latestInputRef.current = "";
    segmentStartMsRef.current = null;
    setTime(duration);
    setStartMs(null);
    setIsFinished(false);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  }, [duration, setWpm, setRawWpm, setAccuracy]);

  useEffect(() => {
    clearQuotePrefetch();
    void loadQuote();
    reset();
  }, [difficulty, loadQuote, reset]);

  useEffect(() => {
    if (!roundFlash) return;
    const id = window.setTimeout(() => setRoundFlash(false), 520);
    return () => window.clearTimeout(id);
  }, [roundFlash]);

  useEffect(() => {
    if (!quote || isLoading || isFinished || loadError) return;
    const remaining = quote.length - input.length;
    const words = quote.trim().split(/\s+/).filter(Boolean);
    const tailStr =
      words.length >= 2 ? words.slice(-2).join(" ") : words[0] ?? quote;
    const threshold = Math.min(tailStr.length + 3, quote.length);
    if (remaining > 0 && remaining <= threshold) {
      prefetchNextQuote();
    }
  }, [quote, input, isLoading, isFinished, loadError]);

  useEffect(() => {
    setTime(duration);
  }, [duration]);

  useEffect(() => {
    if (!quote) return;
    segmentStartMsRef.current = null;
    setInput("");
    latestInputRef.current = "";
  }, [quote]);

  const finishTest = useCallback(
    (finalInput: string, endedAt: number) => {
      if (isFinished) return;

      const stats = computeStats(
        quote,
        finalInput,
        segmentStartMsRef.current,
        endedAt,
      );
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
          finishTest(latestInputRef.current, Date.now());
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
    void audioRef.current.play().catch(() => {
      /* autoplay blocked until user gesture — ignore */
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || isLoading) return;
    const now = Date.now();
    const nextStart = startMs ?? now;

    if (!startMs) setStartMs(now);

    if (segmentStartMsRef.current === null) {
      segmentStartMsRef.current = now;
    }

    playSound();

    const value = e.target.value;
    setInput(value);
    latestInputRef.current = value;

    const stats = computeStats(quote, value, segmentStartMsRef.current, now);
    setAccuracy(stats.accuracy);
    setWpm(stats.wpm);
    setRawWpm(stats.rawWpm);

    if (value.length >= quote.length) {
      if (timeRef.current > 0) {
        const roundStats = computeStats(
          quote,
          value,
          segmentStartMsRef.current,
          now,
        );
        onFinish(roundStats.wpm);
        setWpm(0);
        setRawWpm(0);
        setAccuracy(100);
        setInput("");
        latestInputRef.current = "";
        segmentStartMsRef.current = null;
        setRoundAnnouncement("Round complete. Next quote loading.");
        setRoundFlash(true);
        void loadQuote();
        return;
      }
      finishTest(value, now);
    }
  };

  const progress = quote.length ? (input.length / quote.length) * 100 : 0;

  return (
    <div
      className={`card typing-box${roundFlash ? " typing-box--round-complete" : ""}`}
    >
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
                segmentStartMsRef.current = null;
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

        <button
          type="button"
          className="ghost-btn"
          onClick={() => setSoundOn((prev) => !prev)}
          aria-pressed={soundOn}
          title="Toggle keystroke sound"
        >
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
        disabled={!!loadError || isFinished}
        readOnly={isLoading}
        aria-busy={isLoading}
        aria-label="Typing input area"
      />

      <div className="typing-actions">
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button
          type="button"
          accessKey="n"
          onClick={() => void loadQuote()}
          title="Load a new quote (browser access shortcut when focused elsewhere; often Alt+Shift+N)"
        >
          New quote
        </button>
      </div>

      <p className="keyboard-hints" aria-label="Keyboard shortcuts">
        Tab moves through timer, sound, typing area, then actions. New quote may
        support a browser access shortcut when this control is not focused (see
        its title).
      </p>

      <p className="timer">Time: {time}s</p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {isFinished
          ? "Session finished."
          : roundAnnouncement || "Session in progress."}
      </p>
    </div>
  );
}
