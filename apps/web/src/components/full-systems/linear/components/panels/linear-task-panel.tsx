import { controlButton } from "../../lib/workspace-styles";
import { X } from "lucide-react";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import type { Task } from "../../types";
import { TaskDetails } from "./task-details";
import { TaskInsights } from "./task-insights";

export function LinearTaskPanel({ visibleTasks }: { visibleTasks: Task[] }) {
  const activePanel = useLinearTaskStore((state) => state.activePanel);

  if (!activePanel) return null;

  return (
    <aside
      id="linear-task-panel"
      aria-labelledby="linear-task-panel-title"
      className="max-h-[45%] shrink-0 overflow-auto border-b border-[var(--linear-rule)] bg-[var(--linear-surface)] px-4 pb-4 lg:order-last lg:max-h-none lg:w-60 lg:border-b-0 lg:border-l"
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--linear-rule)] py-2">
        <h3 id="linear-task-panel-title" className="text-sm font-semibold">
          {activePanel === "insights" ? "Insights" : "Issue details"}
        </h3>
        <button
          type="button"
          className={controlButton}
          aria-label="Close panel"
          onClick={() => useLinearTaskStore.getState().closePanel()}
        >
          <X aria-hidden="true" size={15} />
        </button>
      </div>
      {activePanel === "insights" ? (
        <TaskInsights tasks={visibleTasks} />
      ) : (
        <TaskDetails />
      )}
    </aside>
  );
}
