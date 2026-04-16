import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskInput() {
  const { addTask } = useTasks();

  const [text, setText] = useState("");
  const [category, setCategory] = useState("Work");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("medium");

  const submit = () => {
    if (!text.trim()) return;

    addTask({
      text,
      completed: false,
      category,
      priority,
      tags: tags.split(",").map((t) => t.trim()),
    });

    setText("");
    setTags("");
  };

  return (
    <div className="task-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Task..."
      />

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

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="tags"
      />

      <button onClick={submit}>Add Task</button>
    </div>
  );
}
