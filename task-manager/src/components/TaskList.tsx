import { useTasks } from "../context/TaskContext";
import TaskItem from "./TaskItem";

export default function TaskList({ search }: any) {
  const { tasks } = useTasks();

  const filtered = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {filtered.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
