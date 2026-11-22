export const DAY_MS = 86_400_000;

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function toDateInput(dueDate: number) {
  return new Date(dueDate).toISOString().slice(0, 10);
}

export function formatDueDate(dueDate: number) {
  return dateFormatter.format(dueDate);
}

export function isOverdue(dueDate: number) {
  return dueDate < startOfUtcDay(Date.now());
}

export function startOfUtcDay(timestamp: number) {
  return Math.floor(timestamp / DAY_MS) * DAY_MS;
}
