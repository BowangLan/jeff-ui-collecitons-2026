import type { ActiveFilters } from "../store/slices/filter-slice";
import type { ViewOptions } from "../store/slices/view-slice";
import type { Task, TaskPriority, TaskStatus } from "../types";

const statusViews: Record<
  Exclude<ActiveFilters["statusView"], "All issues">,
  ReadonlySet<TaskStatus>
> = {
  Active: new Set(["Todo", "In Progress", "In Review"]),
  Backlog: new Set(["Backlog"]),
  Done: new Set(["Done"]),
};

const priorityRank: Record<TaskPriority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Urgent: 3,
};

const groupOrder: TaskStatus[] = [
  "In Progress",
  "In Review",
  "Todo",
  "Backlog",
  "Done",
];

export function getVisibleTasks(
  data: Task[],
  { statusView, status, priority, label }: ActiveFilters,
  orderBy: ViewOptions["orderBy"],
) {
  const allowedStatuses =
    statusView === "All issues" ? null : statusViews[statusView];
  const tasks = data.filter(
    (task) =>
      (!allowedStatuses || allowedStatuses.has(task.status)) &&
      (!status || task.status === status) &&
      (!priority || task.priority === priority) &&
      (!label || task.labels === label),
  );

  if (orderBy === "Due date") {
    tasks.sort((a, b) => a.dueDate - b.dueDate);
  } else if (orderBy === "Priority") {
    tasks.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  }

  return tasks;
}

export function groupTasks(tasks: Task[], groupBy: ViewOptions["groupBy"]) {
  if (groupBy === "None") return [{ status: null, tasks }];

  const groups = new Map<TaskStatus, Task[]>();
  for (const task of tasks) {
    const group = groups.get(task.status);
    if (group) {
      group.push(task);
    } else {
      groups.set(task.status, [task]);
    }
  }

  return groupOrder.flatMap((status) => {
    const group = groups.get(status);
    return group ? [{ status, tasks: group }] : [];
  });
}
