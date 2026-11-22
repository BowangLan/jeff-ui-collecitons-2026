import { controlButton } from "../../lib/workspace-styles";
import { ListTodo } from "lucide-react";
import { groupTasks } from "../../lib/task-list";
import type { ViewOptions } from "../../store/slices/view-slice";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import type { Task } from "../../types";
import { TaskRow } from "./task-row";
import { TaskStatusIcon } from "./task-status-icon";

type LinearTaskListProps = {
  tasks: Task[];
  total: number;
  groupBy: ViewOptions["groupBy"];
};

export function LinearTaskList({ tasks, total, groupBy }: LinearTaskListProps) {
  return (
    <section
      aria-label="Issue list"
      className="@container min-h-0 min-w-0 flex-1 overflow-auto"
    >
      <div
        className="px-4 py-3 text-xs text-[var(--linear-muted)] sm:px-6"
        role="status"
      >
        {tasks.length === total
          ? `${tasks.length} ${tasks.length === 1 ? "issue" : "issues"}`
          : `${tasks.length} of ${total} issues`}
      </div>
      {tasks.length === 0 ? (
        <div className="grid justify-items-center gap-2 border-t border-[var(--linear-rule)] px-4 py-12 text-center">
          <ListTodo
            aria-hidden="true"
            size={24}
            className="text-[var(--linear-muted)]"
          />
          <p className="font-medium">No issues match this view.</p>
          <button
            type="button"
            className={controlButton}
            onClick={() => useLinearTaskStore.getState().resetFilters()}
          >
            Reset filters
          </button>
        </div>
      ) : (
        groupTasks(tasks, groupBy).map(({ status, tasks: group }) => (
          <section
            key={status ?? "all"}
            aria-label={status ?? "All visible issues"}
          >
            {status ? (
              <h3 className="flex items-center gap-2 border-y border-[var(--linear-rule)] bg-[var(--linear-surface)] px-4 py-2 text-xs font-semibold sm:px-6">
                <TaskStatusIcon status={status} />
                {status}
                <span className="font-normal tabular-nums text-[var(--linear-muted)]">
                  {group.length}
                </span>
              </h3>
            ) : null}
            <ul>
              {group.map((task) => (
                <TaskRow key={task.code} task={task} />
              ))}
            </ul>
          </section>
        ))
      )}
    </section>
  );
}
