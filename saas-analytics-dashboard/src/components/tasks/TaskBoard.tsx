import { DndContext, type DragEndEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const STATUSES: TaskStatus[] = ["backlog", "in_progress", "review", "done"];

const labels: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } });
  const style = { transform: transform ? CSS.Transform.toString(transform) : undefined };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab rounded-md border border-border bg-background p-3 text-sm shadow-sm active:cursor-grabbing",
        isDragging && "opacity-60",
      )}
    >
      <div className="font-medium">{task.title}</div>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant="secondary" className="text-[10px] capitalize">
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

function Column({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` });
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[320px] flex-1 flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-2",
        isOver && "border-primary/60 bg-primary/5",
      )}
    >
      <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{labels[status]}</div>
      <div className="flex flex-1 flex-col gap-2">
        {sorted.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}

export function TaskBoard({
  tasks,
  onMove,
}: {
  tasks: Task[];
  onMove: (taskId: string, status: TaskStatus) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const taskId = String(event.active.id);
    const overRaw = event.over?.id;
    if (overRaw == null) return;
    const overId = String(overRaw);
    if (!overId.startsWith("col-")) return;
    const next = overId.replace("col-", "") as TaskStatus;
    if (!STATUSES.includes(next)) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === next) return;
    onMove(taskId, next);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((s) => (
          <Column key={s} status={s} tasks={tasks.filter((t) => t.status === s)} />
        ))}
      </div>
    </DndContext>
  );
}
