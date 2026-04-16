import { useState } from "react";
import confetti from "canvas-confetti";
import type { Task } from "../types/Task";
import { useTasks } from "../context/TaskContext";

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask, editTask, toggleSelect } = useTasks();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  const handleComplete = () => {
    toggleTask(task.id);

    if (!task.completed) {
      confetti();
    }
  };

  const save = () => {
    editTask(task.id, value);
    setEditing(false);
  };

  return (
    <div className={`task-item ${task.priority}`}>
      <input
        type="checkbox"
        checked={task.selected || false}
        onChange={() => toggleSelect(task.id)}
      />

      {editing ? (
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      ) : (
        <span onClick={handleComplete} className={task.completed ? "done" : ""}>
          {task.text}
        </span>
      )}

      <div className="actions">
        {editing ? (
          <button onClick={save}>✔</button>
        ) : (
          <button onClick={() => setEditing(true)}>✏</button>
        )}

        <button onClick={() => deleteTask(task.id)}>🗑</button>
      </div>
    </div>
  );
}
