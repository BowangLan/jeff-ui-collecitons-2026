import { CircleAlert, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import type { TaskPriority } from "../../types";

const priorityIcons = {
  Low: SignalLow,
  Medium: SignalMedium,
  High: SignalHigh,
  Urgent: CircleAlert,
};

export function TaskPriorityIcon({ priority }: { priority: TaskPriority }) {
  const Icon = priorityIcons[priority];

  return (
    <Icon
      aria-hidden="true"
      size={15}
      strokeWidth={1.8}
      className={
        priority === "Urgent"
          ? "shrink-0 text-[#a34e39]"
          : "shrink-0 text-[var(--linear-muted)]"
      }
    />
  );
}
