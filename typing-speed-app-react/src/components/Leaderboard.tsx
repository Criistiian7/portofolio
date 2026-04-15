import { useEffect, useState } from "react";

type Props = {
  newScore: number | null;
};

export default function Leaderboard({ newScore }: Props) {
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scores") || "[]");
    setScores(saved);
  }, []);

  useEffect(() => {
    if (newScore !== null) {
      const updated = [...scores, newScore].sort((a, b) => b - a).slice(0, 5);

      setScores(updated);
      localStorage.setItem("scores", JSON.stringify(updated));
    }
  }, [newScore]);

  return (
    <div className="card leaderboard">
      <h3 className="card-title">Leaderboard</h3>
      <ul>
        {scores.map((s, i) => (
          <li key={i}>
            #{i + 1} — {s} WPM
          </li>
        ))}
      </ul>
    </div>
  );
}
