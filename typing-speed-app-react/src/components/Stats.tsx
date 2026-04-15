type Props = {
  wpm: number;
  accuracy: number;
};

export default function Stats({ wpm, accuracy }: Props) {
  return (
    <div className="card stats">
      <h3>Stats</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <span>WPM</span>
          <strong>{wpm}</strong>
        </div>
        <div className="stat-box">
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
      </div>
    </div>
  );
}
