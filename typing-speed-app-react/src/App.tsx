import { useState } from "react";
import TypingBox from "./components/TypingBox";
import Stats from "./components/Stats";
import Leaderboard from "./components/Leaderboard";
import DifficultySelector from "./components/DifficultySelector";

function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  return (
    <div className="app">
      <h1 className="title">Typing Speed Test</h1>

      <DifficultySelector setDifficulty={setDifficulty} />

      <div className="dashboard">
        <Stats wpm={wpm} accuracy={accuracy} />
        <Leaderboard newScore={score} />
      </div>

      <TypingBox
        difficulty={difficulty}
        onFinish={(wpm) => setScore(wpm)}
        setWpm={setWpm}
        setAccuracy={setAccuracy}
      />
    </div>
  );
}

export default App;
