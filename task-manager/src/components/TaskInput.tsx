import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskInput() {
  const { addTask } = useTasks();

  const [text, setText] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("medium");

  const submit = () => {
    if (!text.trim()) return;

    addTask({
      text,
      completed: false,
      category,
      priority,
      tags: [desc],
    });

    setText("");
    setDesc("");
  };

  return (
    <div className="task-input">
      <input
        placeholder="Task name..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        placeholder="Description..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="row">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Work</option>
          <option>Personal</option>
          <option>Other</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button onClick={submit}>Add Task</button>
    </div>
  );
}
