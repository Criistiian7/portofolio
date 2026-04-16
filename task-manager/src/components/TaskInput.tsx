import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskInput() {
  const { addTask } = useTasks();

  const [text, setText] = useState("");
  const [category, setCategory] = useState("Work");
  const [tags, setTags] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;

    addTask({
      text,
      completed: false,
      category,
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

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="tags (comma)"
      />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
