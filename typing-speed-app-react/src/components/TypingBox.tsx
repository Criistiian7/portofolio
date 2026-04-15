import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ChangeEvent,
} from "react";
import { fetchQuote } from "../services/api";
import { computeTypingStats } from "../lib/typingStats";

const SOUND_STORAGE_KEY = "typing-sound-enabled";

type Props = {
  difficulty: string;
  onFinish: (payload: { wpm: number; at: number }) => void;
  setWpm: (wpm: number) => void;
  setAccuracy: (acc: number) => void;
};

const DURATION_PRESETS = [15, 30, 60] as const;

export default function TypingBox({
  difficulty,
  onFinish,
  setWpm,
  setAccuracy,
}: Props) {
  const [quote, setQuote] = useState("");
  const [input, setInput] = useState("");
  const [durationSec, setDurationSec] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(SOUND_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const finishedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const quoteRef = useRef("");
  const startedAtRef = useRef<number | null>(null);
  const durationSecRef = useRef(durationSec);
  durationSecRef.current = durationSec;

  const applyDifficultyLength = useCallback((q: string) => {
    if (difficulty === "easy") {
      return q.split(" ").slice(0, 5).join(" ");
    }
    if (difficulty === "medium") {
      return q.split(" ").slice(0, 10).join(" ");
    }
    return q;
  }, [difficulty]);

  const loadQuote = useCallback(async () => {
    setQuoteLoading(true);
    setQuoteError(null);
    try {
      const q = await fetchQuote();
      const modified = applyDifficultyLength(q);
      setQuote(modified);
      quoteRef.current = modified;
    } catch {
      setQuoteError("Could not load a quote. Try again.");
    } finally {
      setQuoteLoading(false);
    }
  }, [applyDifficultyLength]);

  const finishWithInput = useCallback(
    (inputStr: string) => {
      if (finishedRef.current) return;
      const start = startedAtRef.current;
      if (!start) return;

      finishedRef.current = true;
      const now = Date.now();
      const q = quoteRef.current;
      const stats = computeTypingStats({
        quote: q,
        input: inputStr,
        startedAtMs: start,
        nowMs: now,
      });

      setWpm(stats.wpm);
      setAccuracy(stats.accuracy);
      setStartedAtMs(null);
      startedAtRef.current = null;
      onFinish({ wpm: stats.wpm, at: now });
      setLiveAnnouncement(
        `Test finished. ${stats.wpm} WPM, ${stats.accuracy}% accuracy.`,
      );
    },
    [onFinish, setAccuracy, setWpm],
  );

  const reset = useCallback(
    (confirmIfProgress: boolean) => {
      if (
        confirmIfProgress &&
        inputRef.current.length > 0 &&
        startedAtRef.current !== null &&
        !finishedRef.current
      ) {
        if (!window.confirm("Discard current progress and reset?")) return;
      }

      finishedRef.current = false;
      setInput("");
      inputRef.current = "";
      setTimeLeft(durationSec);
      setStartedAtMs(null);
      startedAtRef.current = null;
      setWpm(0);
      setAccuracy(100);
      setLiveAnnouncement("");

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    },
    [durationSec, setAccuracy, setWpm],
  );

  useEffect(() => {
    finishedRef.current = false;
    setInput("");
    inputRef.current = "";
    setStartedAtMs(null);
    startedAtRef.current = null;
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(durationSecRef.current);
    setLiveAnnouncement("");
    void loadQuote();
  }, [difficulty, loadQuote, setWpm, setAccuracy]);

  useEffect(() => {
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}typing.wav`);
    if (audioRef.current) audioRef.current.volume = 0.12;
  }, []);

  useEffect(() => {
    if (!quoteLoading && quote && !quoteError) {
      textareaRef.current?.focus();
    }
  }, [quoteLoading, quote, quoteError]);

  useEffect(() => {
    if (!startedAtMs || finishedRef.current) return;

    const timer = window.setInterval(() => {
      if (finishedRef.current) return;
      setTimeLeft((prev) => {
        if (finishedRef.current) return prev;
        if (prev <= 0) return 0;
        if (prev === 1) {
          finishWithInput(inputRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [startedAtMs, finishWithInput]);

  useEffect(() => {
    if (!startedAtMs || finishedRef.current) return;

    const tick = () => {
      if (finishedRef.current) return;
      const now = Date.now();
      const live = computeTypingStats({
        quote: quoteRef.current,
        input: inputRef.current,
        startedAtMs: startedAtRef.current,
        nowMs: now,
      });
      setWpm(live.wpm);
      setAccuracy(live.accuracy);
    };

    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [input, setAccuracy, setWpm, startedAtMs]);

  const playSound = () => {
    if (!soundEnabled || !audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    } catch {
      /* autoplay blocked or decode error */
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (finishedRef.current) return;

    const value = e.target.value;
    if (!startedAtRef.current) {
      const t = Date.now();
      startedAtRef.current = t;
      setStartedAtMs(t);
    }

    playSound();
    setInput(value);
    inputRef.current = value;

    const q = quoteRef.current;
    if (q.length > 0 && value.length >= q.length) {
      const nextInput = value.slice(0, q.length);
      setInput(nextInput);
      inputRef.current = nextInput;
      if (nextInput.length === q.length) {
        finishWithInput(nextInput);
      }
    }
  };

  const progress = quote.length ? (input.length / quote.length) * 100 : 0;
  const statsNow = computeTypingStats({
    quote,
    input,
    startedAtMs,
    nowMs: Date.now(),
  });
  const progressHue =
    statsNow.accuracy >= 95 ? 142 : statsNow.accuracy >= 80 ? 45 : 0;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const handleDurationChange = (sec: number) => {
    setDurationSec(sec);
    setTimeLeft(sec);
    finishedRef.current = false;
    setInput("");
    inputRef.current = "";
    setStartedAtMs(null);
    startedAtRef.current = null;
    setWpm(0);
    setAccuracy(100);
    setLiveAnnouncement("");
  };

  return (
    <div className="card typing-box">
      <div className="typing-toolbar">
        <div
          className="timer-presets"
          role="group"
          aria-label="Timer length in seconds"
        >
          {DURATION_PRESETS.map((sec) => (
            <button
              key={sec}
              type="button"
              className={`timer-preset${durationSec === sec ? " active" : ""}`}
              onClick={() => handleDurationChange(sec)}
              aria-pressed={durationSec === sec}
            >
              {sec}s
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`sound-toggle${soundEnabled ? " on" : ""}`}
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          title={soundEnabled ? "Sound on" : "Sound off"}
        >
          Sound {soundEnabled ? "on" : "off"}
        </button>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Typing progress"
      >
        <div
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, hsl(${progressHue} 70% 45%), #38bdf8)`,
          }}
        />
      </div>

      {quoteLoading && (
        <p className="quote-status" aria-live="polite">
          Loading quote…
        </p>
      )}

      {quoteError && !quoteLoading && (
        <div className="quote-error">
          <p>{quoteError}</p>
          <button type="button" onClick={() => void loadQuote()}>
            Retry
          </button>
        </div>
      )}

      <p className="quote" aria-hidden={quoteLoading || !!quoteError}>
        {quote.split("").map((char, i) => {
          let color = "";

          if (i < input.length) {
            color = input[i] === char ? "var(--correct)" : "var(--error)";
          }

          return (
            <span key={i} style={{ color }}>
              {char}
            </span>
          );
        })}
      </p>

      <label className="sr-only" htmlFor="typing-input">
        Type the quote shown above
      </label>
      <textarea
        id="typing-input"
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={quoteLoading || !!quoteError || !quote}
        rows={5}
        aria-label="Type the quote shown above"
      />

      <div className="typing-actions">
        <button type="button" onClick={() => reset(true)}>
          Reset
        </button>
      </div>

      <p className="timer" aria-live="polite">
        Time: {timeLeft}s
      </p>

      <div className="sr-only" aria-live="polite">
        {liveAnnouncement}
      </div>
    </div>
  );
}
