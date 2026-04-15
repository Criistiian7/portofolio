import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskInput() {
  const [text, setText] = useState("");
  const { addTask } = useTasks();

  const handleAdd = () => {
    if (!text.trim()) return;
    addTask(text);
    setText("");
  };

  return (
    <div className="task-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
