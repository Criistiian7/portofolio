import { useMemo, useState } from "react";
import {
  type LeaderboardDifficulty,
  type LeaderboardEntry,
} from "../utils/leaderboard";

type Props = {
  scores: LeaderboardEntry[];
};

const FILTER_OPTIONS: { value: "all" | LeaderboardDifficulty; label: string }[] = [
  { value: "all", label: "All" },
  { value: "easy", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Long" },
];

const DIFFICULTY_LABEL: Record<LeaderboardDifficulty, string> = {
  easy: "Short",
  medium: "Medium",
  hard: "Long",
};

export default function Leaderboard({ scores }: Props) {
  const [filter, setFilter] = useState<"all" | LeaderboardDifficulty>("all");

  const visible = useMemo(() => {
    const list =
      filter === "all" ? scores : scores.filter((s) => s.difficulty === filter);
    return [...list].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
  }, [scores, filter]);

  return (
    <div className="card leaderboard">
      <div className="leaderboard-header">
        <h3 className="card-title">Leaderboard</h3>
        <div className="leaderboard-filters" role="group" aria-label="Filter by difficulty">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`segment ${filter === opt.value ? "active" : ""}`}
              onClick={() => setFilter(opt.value)}
              aria-pressed={filter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ul>
        {visible.length === 0 ? (
          <li className="leaderboard-empty">No scores yet.</li>
        ) : (
          visible.map((score, i) => (
            <li key={`${score.name}-${score.at}-${score.difficulty}-${i}`}>
              <span className="leaderboard-rank">#{i + 1}</span>
              <span className="leaderboard-name">{score.name}</span>
              <span className="leaderboard-wpm">{score.wpm} WPM</span>
              <span className="leaderboard-difficulty" title="Quote length">
                {DIFFICULTY_LABEL[score.difficulty]}
              </span>
              <time className="leaderboard-date" dateTime={score.at}>
                {new Date(score.at).toLocaleDateString()}
              </time>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
