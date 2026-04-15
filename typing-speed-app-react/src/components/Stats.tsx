type Props = {
  wpm: number;
  accuracy: number;
};

export default function Stats({ wpm, accuracy }: Props) {
  return (
    <div>
      <h3>Stats</h3>
      <p>WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
    </div>
  );
}
