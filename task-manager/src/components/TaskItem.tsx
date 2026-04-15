import { Task } from "../types/Task";
import { useTasks } from "../context/TaskContext";

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();

  return (
    <div className="task-item">
      <span
        onClick={() => toggleTask(task.id)}
        className={task.completed ? "done" : ""}
      >
        {task.text}
      </span>

      <button onClick={() => deleteTask(task.id)}>X</button>
    </div>
  );
}
