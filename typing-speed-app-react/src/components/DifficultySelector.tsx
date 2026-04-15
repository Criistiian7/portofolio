type Props = {
  difficulty: string;
  setDifficulty: (value: string) => void;
};

const OPTIONS = [
  { value: "easy", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Long" },
];

export default function DifficultySelector({ difficulty, setDifficulty }: Props) {
  return (
    <div className="difficulty" role="group" aria-label="Quote length">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`segment ${difficulty === option.value ? "active" : ""}`}
          onClick={() => setDifficulty(option.value)}
          aria-pressed={difficulty === option.value}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
