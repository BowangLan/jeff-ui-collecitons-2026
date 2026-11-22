import { formatDueDate, isOverdue, toDateInput } from "../../lib/due-date";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import type { Task } from "../../types";
import { TaskLabelBadge } from "./task-label-badge";
import { TaskPriorityIcon } from "./task-priority-icon";
import { TaskStatusIcon } from "./task-status-icon";

export function TaskRow({ task }: { task: Task }) {
  const selected = useLinearTaskStore(
    (state) =>
      state.activePanel === "details" && state.selectedTaskCode === task.code,
  );
  const overdue = task.status !== "Done" && isOverdue(task.dueDate);

  return (
    <li className="border-b border-[var(--linear-rule)] last:border-b-0">
      <button
        type="button"
        aria-expanded={selected}
        aria-controls={selected ? "linear-task-panel" : undefined}
        onClick={() => useLinearTaskStore.getState().selectTask(task.code)}
        className="grid w-full cursor-pointer grid-cols-[1rem_3.25rem_minmax(0,1fr)_3.5rem] items-center gap-x-2.5 gap-y-1 focus-visible:-outline-offset-2 @lg:grid-cols-[1rem_4.25rem_minmax(0,1fr)_7.5rem_3.5rem] @lg:gap-x-3.5 px-4 py-2.5 text-left hover:bg-[var(--linear-surface)] aria-expanded:bg-[var(--linear-selected)] sm:px-6"
      >
        <span className="col-start-1 row-start-1" title={task.status}>
          <TaskStatusIcon status={task.status} />
          <span className="sr-only">{task.status}</span>
        </span>
        <span className="col-start-2 row-start-2 @lg:row-start-1 font-mono text-[11px] tabular-nums text-[var(--linear-muted)]">
          {task.code}
        </span>
        <span className="col-span-2 col-start-2 row-start-1 @lg:col-span-1 @lg:col-start-3 min-w-0 break-words text-[13px] font-medium">
          {task.title}
        </span>
        <span className="flex min-w-0 items-center gap-2 col-span-2 col-start-3 row-start-2 @lg:col-span-1 @lg:col-start-4 @lg:row-start-1">
          <TaskLabelBadge label={task.labels} />
          <span
            className="ml-auto flex shrink-0"
            title={`${task.priority} priority`}
          >
            <TaskPriorityIcon priority={task.priority} />
            <span className="sr-only">{task.priority} priority</span>
          </span>
        </span>
        <time
          dateTime={toDateInput(task.dueDate)}
          className={`whitespace-nowrap text-right text-xs tabular-nums col-start-4 row-start-1 @lg:col-start-5 ${overdue ? "font-medium text-[#9a4837]" : "text-[var(--linear-muted)]"}`}
        >
          <span className="sr-only">{overdue ? "Overdue, due " : "Due "}</span>
          {formatDueDate(task.dueDate)}
        </time>
      </button>
    </li>
  );
}
