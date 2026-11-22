import type { Task } from "../types";
import { DAY_MS, startOfUtcDay } from "./due-date";

const today = startOfUtcDay(Date.now());
const issues: [
  Task["title"],
  Task["status"],
  Task["priority"],
  Task["labels"],
  number,
][] = [
  [
    "Write the workspace onboarding checklist",
    "Todo",
    "Medium",
    "Improvement",
    6,
  ],
  [
    "Resolve clipped menu on narrow screens",
    "In Progress",
    "Urgent",
    "Bug",
    -1,
  ],
  [
    "Explore keyboard shortcuts for issue triage",
    "Backlog",
    "Low",
    "Feature",
    14,
  ],
  [
    "Tighten spacing in the issue detail panel",
    "In Review",
    "Medium",
    "Design",
    2,
  ],
  ["Add an empty state for saved views", "In Progress", "High", "Design", 1],
  ["Fix focus return after dismissing a dialog", "Todo", "High", "Bug", 4],
  ["Draft the project archive flow", "Backlog", "Medium", "Design", 21],
  ["Add a due date field to issue creation", "Done", "High", "Feature", -2],
  ["Add labels to exported issues", "Todo", "Low", "Feature", 9],
  [
    "Audit workspace navigation with a screen reader",
    "In Review",
    "High",
    "Improvement",
    3,
  ],
  ["Refresh the workspace settings copy", "Done", "Low", "Improvement", -4],
  ["Investigate duplicate notification badges", "Backlog", "Medium", "Bug", 12],
  ["Preserve the selected view after reload", "Done", "Medium", "Bug", -7],
];

export const initialTasks: Task[] = issues.map(
  ([title, status, priority, labels, days], index) => ({
    code: `STU-${113 - index}`,
    title,
    status,
    priority,
    labels,
    dueDate: today + days * DAY_MS,
  }),
);
