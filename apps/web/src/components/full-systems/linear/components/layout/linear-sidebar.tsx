import { Layers3, ListTodo } from "lucide-react";
import { labelColors } from "../../lib/task-appearance";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import { TASK_LABELS } from "../../types";

export function LinearSidebar() {
  const activeLabel = useLinearTaskStore((state) => state.activeFilters.label);

  return (
    <aside className="shrink-0 bg-[var(--linear-side)] px-3 py-3 text-[var(--linear-side-ink)] md:w-48 md:px-4 md:py-6">
      <div className="flex items-center gap-2.5 md:mb-8">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#d7e5cb] text-[var(--linear-side)]">
          <Layers3 aria-hidden="true" size={17} />
        </span>
        <span className="text-sm font-semibold tracking-tight">Studio</span>
      </div>

      <nav
        aria-label="Workspace"
        className="mt-2 flex min-w-0 flex-wrap items-start gap-1 md:mt-0 md:flex-col md:items-stretch"
      >
        <button
          type="button"
          onClick={() => useLinearTaskStore.getState().resetFilters()}
          className="flex min-h-8 cursor-pointer items-center gap-2 rounded-md bg-white/10 px-2 text-left text-xs font-semibold hover:bg-white/15"
        >
          <ListTodo aria-hidden="true" size={15} />
          My issues
        </button>

        <h3 className="sr-only text-xs font-medium text-[var(--linear-side-muted)] md:not-sr-only md:mb-1 md:mt-6 md:px-2">
          Labels
        </h3>
        {TASK_LABELS.map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={activeLabel === label}
            onClick={() =>
              useLinearTaskStore
                .getState()
                .setFilters({ label: activeLabel === label ? null : label })
            }
            className="flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-left text-xs text-[var(--linear-side-muted)] hover:bg-white/10 aria-pressed:bg-white/15 aria-pressed:text-[var(--linear-side-ink)]"
          >
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${labelColors[label].dot}`}
            />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
