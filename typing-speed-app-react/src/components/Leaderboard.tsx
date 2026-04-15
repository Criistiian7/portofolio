import { useEffect, useState } from "react";
import {
  type LeaderboardEntry,
  LEADERBOARD_STORAGE_KEY,
  mergeNewEntry,
  readLeaderboard,
} from "../lib/leaderboard";

export type FinishSignal = { wpm: number; at: number } | null;

type Props = {
  userName: string;
  finishSignal: FinishSignal;
};

export default function Leaderboard({ userName, finishSignal }: Props) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setScores(readLeaderboard(localStorage));
  }, []);

  useEffect(() => {
    if (!finishSignal) return;

    const entry: LeaderboardEntry = {
      name: userName,
      wpm: finishSignal.wpm,
      at: finishSignal.at,
    };

    const current = readLeaderboard(localStorage);
    const updated = mergeNewEntry(current, entry);
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
    setScores(updated);
  }, [finishSignal, userName]);

  return (
    <div className="card leaderboard">
      <h3 className="card-title">Leaderboard</h3>
      <ul>
        {scores.map((s, i) => (
          <li key={`${s.at}-${i}`}>
            #{i + 1} — {s.name} — {s.wpm} WPM
            <span className="leaderboard-date">
              {" "}
              ({new Date(s.at).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
