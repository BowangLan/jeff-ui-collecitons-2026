import { isOverdue } from "../../lib/due-date";
import { TASK_STATUSES, type Task, type TaskStatus } from "../../types";
import { TaskStatusIcon } from "../tasks/task-status-icon";

export function TaskInsights({ tasks }: { tasks: Task[] }) {
  const counts: Record<TaskStatus, number> = {
    Backlog: 0,
    Todo: 0,
    "In Progress": 0,
    "In Review": 0,
    Done: 0,
  };
  let overdue = 0;

  for (const task of tasks) {
    counts[task.status] += 1;
    if (task.status !== "Done" && isOverdue(task.dueDate)) overdue += 1;
  }

  const completed =
    tasks.length > 0 ? Math.round((counts.Done / tasks.length) * 100) : 0;

  return (
    <>
      <p className="text-xs text-[var(--linear-muted)]">Issues in this view</p>
      <div className="mt-3 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium">Completed</span>
        <span className="font-semibold tabular-nums">{completed}%</span>
      </div>
      <progress
        aria-label="Completed issues"
        className="mt-1.5 block h-1.5 w-full accent-[var(--linear-accent)]"
        max={100}
        value={completed}
      />

      <dl className="mt-4 grid grid-cols-[1fr_auto] items-center gap-y-2.5 text-xs">
        {TASK_STATUSES.map((status) => (
          <div
            key={status}
            className="col-span-2 grid grid-cols-subgrid items-center"
          >
            <dt className="flex items-center gap-2">
              <TaskStatusIcon status={status} />
              {status}
            </dt>
            <dd className="tabular-nums text-[var(--linear-muted)]">
              {counts[status]}
            </dd>
          </div>
        ))}
        <div className="col-span-2 mt-1 grid grid-cols-subgrid border-t border-[var(--linear-rule)] pt-3">
          <dt className="font-medium">Overdue</dt>
          <dd className="tabular-nums text-[var(--linear-muted)]">{overdue}</dd>
        </div>
      </dl>
    </>
  );
}
