import { labelColors } from "../../lib/task-appearance";
import type { TaskLabel } from "../../types";

export function TaskLabelBadge({ label }: { label: TaskLabel }) {
  return (
    <span
      className={`w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] leading-4 font-medium ${labelColors[label].badge}`}
    >
      {label}
    </span>
  );
}
