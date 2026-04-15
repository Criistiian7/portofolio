type Props = {
  difficulty: string;
  setDifficulty: (value: string) => void;
};

const OPTIONS = [
  { id: "easy", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Long" },
] as const;

export default function DifficultySelector({
  difficulty,
  setDifficulty,
}: Props) {
  return (
    <div
      className="difficulty"
      role="group"
      aria-label="Quote length"
    >
      {OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`difficulty-btn${difficulty === id ? " active" : ""}`}
          onClick={() => setDifficulty(id)}
          aria-pressed={difficulty === id}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
