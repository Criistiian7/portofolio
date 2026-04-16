import { useState, useEffect } from "react";
import { TaskProvider } from "./context/TaskContext";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";
import Auth from "./components/Auth";

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(saved);
  }, []);

  if (!user) return <Auth setUser={setUser} />;

  return (
    <TaskProvider>
      <div className="app">
        <h1>Task Manager</h1>

        <SearchBar setSearch={setSearch} />
        <TaskInput />
        <TaskList search={search} />
      </div>
    </TaskProvider>
  );
}
