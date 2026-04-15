type Props = {
  setDifficulty: (value: string) => void;
};

export default function DifficultySelector({ setDifficulty }: Props) {
  return (
    <div className="difficulty">
      <button onClick={() => setDifficulty("easy")}>Easy</button>
      <button onClick={() => setDifficulty("medium")}>Medium</button>
      <button onClick={() => setDifficulty("hard")}>Hard</button>
    </div>
  );
}
