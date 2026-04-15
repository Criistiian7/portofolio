type Props = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
};

export default function Stats({ wpm, rawWpm, accuracy }: Props) {
  return (
    <div className="card stats" aria-live="polite">
      <h3 className="card-title">Stats</h3>

      <div className="stats-grid">
        <div className="stat-box">
          <span>WPM</span>
          <strong>{wpm}</strong>
        </div>

        <div className="stat-box">
          <span>Raw WPM</span>
          <strong>{rawWpm}</strong>
        </div>

        <div className="stat-box">
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
      </div>
    </div>
  );
}
