import type { Task } from "../types/Task";
import { useTasks } from "../context/TaskContext";

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();

  return (
    <div className="task-item">
      <div>
        <span
          onClick={() => toggleTask(task.id)}
          className={task.completed ? "done" : ""}
        >
          {task.text}
        </span>

        <div className="meta">
          <small>{task.category}</small>
          <div className="tags">
            {task.tags.map((t, i) => (
              <span key={i}>#{t}</span>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => deleteTask(task.id)}>🗑</button>
    </div>
  );
}
