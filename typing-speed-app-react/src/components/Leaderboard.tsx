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
    <div>
      <h3>Leaderboard</h3>
      <ul>
        {scores.map((score, i) => (
          <li key={i}>{score} WPM</li>
        ))}
      </ul>
    </div>
  );
}
