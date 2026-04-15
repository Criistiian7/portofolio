import { useState, useEffect, useCallback } from "react";
import TypingBox from "./components/TypingBox";
import Stats from "./components/Stats";
import Leaderboard, { type FinishSignal } from "./components/Leaderboard";
import DifficultySelector from "./components/DifficultySelector";
import Auth from "./components/Auth";
import { useTheme } from "./hooks/useTheme";

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [finishSignal, setFinishSignal] = useState<FinishSignal>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(saved);
  }, []);

  const handleFinish = useCallback((payload: { wpm: number; at: number }) => {
    setFinishSignal(payload);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setFinishSignal(null);
  }, []);

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <h1 className="title">Typing Test</h1>
          <p className="subtitle">
            Measure speed and accuracy on random quotes. Finish when the timer
            ends or you complete the text.
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <p className="user-line">
        Welcome, <span className="user-name">{user}</span>
      </p>

      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

      <div className="dashboard">
        <Stats wpm={wpm} accuracy={accuracy} />
        <Leaderboard userName={user} finishSignal={finishSignal} />
      </div>

      <TypingBox
        difficulty={difficulty}
        onFinish={handleFinish}
        setWpm={setWpm}
        setAccuracy={setAccuracy}
      />
    </div>
  );
}

export default App;
