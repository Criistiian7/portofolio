export type Task = {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  tags: string[];
  priority: "low" | "medium" | "high";
};
