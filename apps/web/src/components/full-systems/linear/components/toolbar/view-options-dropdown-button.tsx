import { controlButton, field, popup } from "../../lib/workspace-styles";
import { SlidersHorizontal } from "lucide-react";
import { Popover } from "radix-ui";
import {
  ISSUE_GROUPINGS,
  ISSUE_ORDERINGS,
  type ViewOptions,
} from "../../store/slices/view-slice";
import { useLinearTaskStore } from "../../store/use-linear-task-store";

export function ViewOptionsDropdownButton() {
  const { groupBy, orderBy } = useLinearTaskStore((state) => state.viewOptions);

  return (
    <Popover.Root>
      <Popover.Trigger type="button" className={controlButton}>
        <SlidersHorizontal aria-hidden="true" size={14} />
        Display
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label="Display options"
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className={`${popup} grid w-48 gap-3 p-3 text-xs`}
        >
          <label className="grid gap-1.5">
            Group by
            <select
              className={field}
              value={groupBy}
              onChange={(event) =>
                useLinearTaskStore.getState().setViewOptions({
                  groupBy: event.currentTarget.value as ViewOptions["groupBy"],
                })
              }
            >
              {ISSUE_GROUPINGS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5">
            Order by
            <select
              className={field}
              value={orderBy}
              onChange={(event) =>
                useLinearTaskStore.getState().setViewOptions({
                  orderBy: event.currentTarget.value as ViewOptions["orderBy"],
                })
              }
            >
              {ISSUE_ORDERINGS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
