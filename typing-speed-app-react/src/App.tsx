import { useState } from "react";
import TypingBox from "./components/TypingBox";
import Stats from "./components/Stats";
import Leaderboard from "./components/Leaderboard";
import DifficultySelector from "./components/DifficultySelector";
import Auth from "./components/Auth";
import { useTheme } from "./hooks/useTheme";
import {
  LEADERBOARD_STORAGE_KEY,
  mergeScore,
  parseLeaderboard,
  type LeaderboardEntry,
} from "./utils/leaderboard";

function App() {
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem("user"),
  );
  const [difficulty, setDifficulty] = useState("easy");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    parseLeaderboard(localStorage.getItem(LEADERBOARD_STORAGE_KEY)),
  );
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const { theme, toggleTheme } = useTheme();
  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="app">
      <div className="top-bar">
        <div>
          <h1 className="title">Typing Test Pro</h1>
          <p className="subtitle">Measure speed and consistency in short focused sessions.</p>
        </div>
        <div className="top-actions">
          <button type="button" className="ghost-btn" onClick={toggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button type="button" className="ghost-btn danger" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <p className="user">Welcome, {user}</p>

      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

      <div className="dashboard">
        <Stats wpm={wpm} rawWpm={rawWpm} accuracy={accuracy} />
        <Leaderboard scores={leaderboard} />
      </div>

      <TypingBox
        difficulty={difficulty}
        onFinish={(finalWpm) => {
          const entry: LeaderboardEntry = {
            name: user,
            wpm: finalWpm,
            at: new Date().toISOString(),
          };

          setLeaderboard((prev) => {
            const updated = mergeScore(prev, entry);
            localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        }}
        setWpm={setWpm}
        setRawWpm={setRawWpm}
        setAccuracy={setAccuracy}
      />
    </div>
  );
}

export default App;
