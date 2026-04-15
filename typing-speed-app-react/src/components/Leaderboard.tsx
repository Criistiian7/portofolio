import { type LeaderboardEntry } from "../utils/leaderboard";

type Props = {
  scores: LeaderboardEntry[];
};

export default function Leaderboard({ scores }: Props) {
  return (
    <div className="card leaderboard">
      <h3 className="card-title">Leaderboard</h3>
      <ul>
        {scores.length === 0 ? (
          <li className="leaderboard-empty">No scores yet.</li>
        ) : (
          scores.map((score, i) => (
            <li key={`${score.name}-${score.at}-${i}`}>
              <span className="leaderboard-rank">#{i + 1}</span>
              <span className="leaderboard-name">{score.name}</span>
              <span className="leaderboard-wpm">{score.wpm} WPM</span>
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
