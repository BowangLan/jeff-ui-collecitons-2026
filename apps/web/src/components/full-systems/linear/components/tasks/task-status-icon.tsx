import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Contrast,
} from "lucide-react";
import type { TaskStatus } from "../../types";

const statusAppearance = {
  Backlog: { Icon: CircleDashed, color: "text-[#72776c]" },
  Todo: { Icon: Circle, color: "text-[#6b7669]" },
  "In Progress": { Icon: Contrast, color: "text-[#97701e]" },
  "In Review": { Icon: CircleDot, color: "text-[#695496]" },
  Done: { Icon: CircleCheck, color: "text-[#3b7757]" },
};

export function TaskStatusIcon({ status }: { status: TaskStatus }) {
  const { Icon, color } = statusAppearance[status];
  return (
    <Icon
      aria-hidden="true"
      size={15}
      strokeWidth={1.8}
      className={`shrink-0 ${color}`}
    />
  );
}
