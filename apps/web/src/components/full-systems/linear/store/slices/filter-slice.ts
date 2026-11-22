import type { StateCreator } from "zustand";
import type { TaskLabel, TaskPriority, TaskStatus } from "../../types";
import type { LinearTaskStore } from "../use-linear-task-store";

export const STATUS_VIEWS = [
  "All issues",
  "Active",
  "Backlog",
  "Done",
] as const;

export type ActiveFilters = {
  statusView: (typeof STATUS_VIEWS)[number];
  status: TaskStatus | null;
  priority: TaskPriority | null;
  label: TaskLabel | null;
};

export type FilterSlice = {
  activeFilters: ActiveFilters;
  setFilters: (filters: Partial<ActiveFilters>) => void;
  resetFilters: () => void;
};

const defaultFilters: ActiveFilters = {
  statusView: "All issues",
  status: null,
  priority: null,
  label: null,
};

export const createFilterSlice: StateCreator<
  LinearTaskStore,
  [],
  [],
  FilterSlice
> = (set) => ({
  activeFilters: defaultFilters,
  setFilters: (filters) =>
    set(({ activeFilters }) => ({
      activeFilters: { ...activeFilters, ...filters },
    })),
  resetFilters: () => set({ activeFilters: defaultFilters }),
});
