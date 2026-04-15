import { useState, useEffect } from "react";
import TypingBox from "./components/TypingBox";
import Stats from "./components/Stats";
import Leaderboard from "./components/Leaderboard";
import DifficultySelector from "./components/DifficultySelector";
import Auth from "./components/Auth";

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(saved);
  }, []);

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      <div className="top-bar">
        <h1 className="title">Typing Test</h1>
        <button onClick={() => setDark(!dark)}>
          {dark ? "Light" : "Dark"}
        </button>
      </div>

      <p className="user">Welcome, {user}</p>

      <DifficultySelector setDifficulty={setDifficulty} />

      <div className="dashboard">
        <Stats wpm={wpm} accuracy={accuracy} />
        <Leaderboard newScore={score} />
      </div>

      <TypingBox
        difficulty={difficulty}
        onFinish={setScore}
        setWpm={setWpm}
        setAccuracy={setAccuracy}
      />
    </div>
  );
}

export default App;
