import { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [search, setSearch] = useState("");

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
