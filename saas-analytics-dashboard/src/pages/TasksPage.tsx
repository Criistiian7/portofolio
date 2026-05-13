import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { KanbanSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from "@/hooks/queries/useTasksQuery";
import type { TaskPriority, TaskStatus } from "@/types";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/system/EmptyState";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { PRODUCT_NAME } from "@/brand/constants";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["backlog", "in_progress", "review", "done"]),
});

type Form = z.infer<typeof schema>;

export default function TasksPage() {
  const { user } = useAuth();
  const uid = user?.uid;
  const tasks = useTasksQuery(uid);
  const create = useCreateTaskMutation(uid);
  const update = useUpdateTaskMutation(uid);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", priority: "medium", status: "backlog" },
  });

  const list = useMemo(() => tasks.data ?? [], [tasks.data]);

  const onSubmit = form.handleSubmit(async (values) => {
    await create.mutateAsync({
      title: values.title,
      description: values.description ?? "",
      priority: values.priority as TaskPriority,
      status: values.status as TaskStatus,
      order: list.filter((t) => t.status === values.status).length,
    });
    toast.success("Task created");
    form.reset({ title: "", description: "", priority: "medium", status: "backlog" });
  });

  return (
    <div className="space-y-4">
      <DocumentTitle title={`Tasks — ${PRODUCT_NAME}`} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">List + Kanban share the same Firestore collection.</p>
      </div>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New task</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...form.register("title")} />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...form.register("description")} />
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={form.watch("priority")}
                    onValueChange={(v) => form.setValue("priority", v as Form["priority"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) => form.setValue("status", v as Form["status"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={create.isPending}>
                    Add task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {tasks.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : list.length === 0 ? (
              <EmptyState
                icon={KanbanSquare}
                title="No tasks yet"
                description="Create your first task above, or switch to the board tab once cards exist."
              />
            ) : (
              list.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{t.priority}</Badge>
                    <Badge variant="outline">{t.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="board">
          {tasks.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading board…</p>
          ) : (
            <TaskBoard
              tasks={list}
              onMove={(taskId, status) => {
                const order = list.filter((t) => t.status === status && t.id !== taskId).length;
                update.mutate({ id: taskId, patch: { status, order } });
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
