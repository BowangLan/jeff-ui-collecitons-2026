import { controlButton } from "../../lib/workspace-styles";
import { ChartNoAxesColumn, PanelRight } from "lucide-react";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import { FilterOptionsDropdownButton } from "./filter-options-dropdown-button";
import { StatusFilterButtonGroup } from "./status-filter-button-group";
import { ViewOptionsDropdownButton } from "./view-options-dropdown-button";

export function LinearToolbarRow() {
  const activePanel = useLinearTaskStore((state) => state.activePanel);

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-[var(--linear-rule)] px-4 pb-3 sm:px-6">
      <StatusFilterButtonGroup />
      <div className="flex flex-wrap items-center gap-0.5">
        <FilterOptionsDropdownButton />
        <ViewOptionsDropdownButton />
        <button
          type="button"
          className={controlButton}
          aria-label="Insights"
          title="Insights"
          aria-pressed={activePanel === "insights"}
          onClick={() => useLinearTaskStore.getState().togglePanel("insights")}
        >
          <ChartNoAxesColumn aria-hidden="true" size={16} />
        </button>
        <button
          type="button"
          className={controlButton}
          aria-label="Issue details"
          title="Issue details"
          aria-pressed={activePanel === "details"}
          onClick={() => useLinearTaskStore.getState().togglePanel("details")}
        >
          <PanelRight aria-hidden="true" size={15} />
        </button>
      </div>
    </div>
  );
}
