import { useState } from "react";
import { TaskProvider, useTasks } from "./context/TaskContext";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Filter from "./components/Filter";

function AppContent() {
  const { tasks } = useTasks();
  const [filter, setFilter] = useState("all");

  const filtered = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="app">
      <h1>Task Manager</h1>

      <TaskInput />
      <Filter setFilter={setFilter} />

      {filtered.map((task) => (
        <div key={task.id}>{task.text}</div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
