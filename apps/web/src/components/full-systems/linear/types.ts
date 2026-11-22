export const TASK_STATUSES = [
  "Backlog",
  "Todo",
  "In Progress",
  "In Review",
  "Done",
] as const;
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export const TASK_LABELS = ["Bug", "Design", "Feature", "Improvement"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskLabel = (typeof TASK_LABELS)[number];

export type Task = {
  code: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: TaskLabel;
  dueDate: number;
};
