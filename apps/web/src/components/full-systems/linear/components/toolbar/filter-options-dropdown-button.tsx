import { controlButton, field, popup } from "../../lib/workspace-styles";
import { ListFilter } from "lucide-react";
import { Popover } from "radix-ui";
import { useShallow } from "zustand/react/shallow";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import {
  TASK_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
} from "../../types";

export function FilterOptionsDropdownButton() {
  const { status, priority, label } = useLinearTaskStore(
    useShallow(({ activeFilters }) => ({
      status: activeFilters.status,
      priority: activeFilters.priority,
      label: activeFilters.label,
    })),
  );

  const count =
    Number(Boolean(status)) +
    Number(Boolean(priority)) +
    Number(Boolean(label));

  return (
    <Popover.Root>
      <Popover.Trigger type="button" className={controlButton}>
        <ListFilter aria-hidden="true" size={15} />
        Filter{count > 0 ? ` (${count})` : null}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label="Issue filters"
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className={`${popup} grid w-56 gap-3 p-3 text-xs`}
        >
          <label className="grid gap-1.5">
            Status
            <select
              className={field}
              value={status ?? ""}
              onChange={(event) => {
                const status = (event.currentTarget.value || null) as
                  | Task["status"]
                  | null;
                useLinearTaskStore
                  .getState()
                  .setFilters(
                    status ? { status, statusView: "All issues" } : { status },
                  );
              }}
            >
              <option value="">Any status</option>
              {TASK_STATUSES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            Priority
            <select
              className={field}
              value={priority ?? ""}
              onChange={(event) =>
                useLinearTaskStore.getState().setFilters({
                  priority: (event.currentTarget.value || null) as
                    | Task["priority"]
                    | null,
                })
              }
            >
              <option value="">Any priority</option>
              {TASK_PRIORITIES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            Label
            <select
              className={field}
              value={label ?? ""}
              onChange={(event) =>
                useLinearTaskStore.getState().setFilters({
                  label: (event.currentTarget.value || null) as
                    | Task["labels"]
                    | null,
                })
              }
            >
              <option value="">Any label</option>
              {TASK_LABELS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={`${controlButton} justify-self-start`}
            onClick={() =>
              useLinearTaskStore
                .getState()
                .setFilters({ status: null, priority: null, label: null })
            }
          >
            Clear filters
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
