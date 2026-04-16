import type { Task } from "../types/Task";
import { useTasks } from "../context/TaskContext";

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();

  return (
    <div className={`task-item ${task.priority}`}>
      <div>
        <span onClick={() => toggleTask(task.id)}>{task.text}</span>

        <div className="meta">
          {task.category} • {task.priority}
        </div>

        <div className="tags">
          {task.tags.map((t, i) => (
            <span key={i}>#{t}</span>
          ))}
        </div>
      </div>

      <button onClick={() => deleteTask(task.id)}>✕</button>
    </div>
  );
}
