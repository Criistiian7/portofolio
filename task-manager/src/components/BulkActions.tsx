import { useTasks } from "../context/TaskContext";

export default function BulkActions() {
  const { selectAll, deleteSelected } = useTasks();

  return (
    <div className="bulk">
      <button onClick={selectAll}>Select All</button>
      <button onClick={deleteSelected}>Delete Selected</button>
    </div>
  );
}
