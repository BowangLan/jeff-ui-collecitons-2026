import { controlButton } from "../../lib/workspace-styles";
import { STATUS_VIEWS } from "../../store/slices/filter-slice";
import { useLinearTaskStore } from "../../store/use-linear-task-store";

export function StatusFilterButtonGroup() {
  const statusView = useLinearTaskStore(
    (state) => state.activeFilters.statusView,
  );

  return (
    <div
      role="group"
      aria-label="Issue status views"
      className="flex flex-wrap items-center gap-0.5"
    >
      {STATUS_VIEWS.map((view) => (
        <button
          key={view}
          type="button"
          aria-pressed={view === statusView}
          className={controlButton}
          onClick={() =>
            useLinearTaskStore
              .getState()
              .setFilters({ statusView: view, status: null })
          }
        >
          {view}
        </button>
      ))}
    </div>
  );
}
