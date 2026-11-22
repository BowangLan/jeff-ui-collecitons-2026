import { controlButton } from "../../lib/workspace-styles";
import { Pencil } from "lucide-react";
import { formatDueDate, toDateInput } from "../../lib/due-date";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import { TaskEditorDialog } from "../tasks/task-editor-dialog";
import { TaskLabelBadge } from "../tasks/task-label-badge";
import { TaskPriorityIcon } from "../tasks/task-priority-icon";
import { TaskStatusIcon } from "../tasks/task-status-icon";

export function TaskDetails() {
  const task = useLinearTaskStore(({ data, selectedTaskCode }) =>
    data.find((issue) => issue.code === selectedTaskCode),
  );

  if (!task) {
    return (
      <p className="text-[13px] text-[var(--linear-muted)]">
        Select an issue to see its details.
      </p>
    );
  }

  return (
    <>
      <p className="font-mono text-xs text-[var(--linear-muted)]">
        {task.code}
      </p>
      <h4 className="mt-1 break-words text-base leading-snug font-semibold">
        {task.title}
      </h4>

      <dl className="my-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 text-xs">
        <dt className="text-[var(--linear-muted)]">Status</dt>
        <dd className="flex items-center gap-1.5">
          <TaskStatusIcon status={task.status} />
          {task.status}
        </dd>
        <dt className="text-[var(--linear-muted)]">Priority</dt>
        <dd className="flex items-center gap-1.5">
          <TaskPriorityIcon priority={task.priority} />
          {task.priority}
        </dd>
        <dt className="text-[var(--linear-muted)]">Label</dt>
        <dd>
          <TaskLabelBadge label={task.labels} />
        </dd>
        <dt className="text-[var(--linear-muted)]">Due date</dt>
        <dd>
          <time dateTime={toDateInput(task.dueDate)}>
            {formatDueDate(task.dueDate)}
          </time>
        </dd>
      </dl>

      <TaskEditorDialog key={task.code} task={task}>
        <button type="button" className={`${controlButton} -ml-2.5`}>
          <Pencil aria-hidden="true" size={13} />
          Edit issue
        </button>
      </TaskEditorDialog>
    </>
  );
}
