import type { StateCreator } from "zustand";
import type { LinearTaskStore } from "../use-linear-task-store";

export const ISSUE_GROUPINGS = ["Status", "None"] as const;
export const ISSUE_ORDERINGS = ["Newest", "Due date", "Priority"] as const;

export type ViewOptions = {
  groupBy: (typeof ISSUE_GROUPINGS)[number];
  orderBy: (typeof ISSUE_ORDERINGS)[number];
};

export type ViewSlice = {
  viewOptions: ViewOptions;
  setViewOptions: (options: Partial<ViewOptions>) => void;
};

export const createViewSlice: StateCreator<
  LinearTaskStore,
  [],
  [],
  ViewSlice
> = (set) => ({
  viewOptions: { groupBy: "Status", orderBy: "Newest" },
  setViewOptions: (options) =>
    set(({ viewOptions }) => ({ viewOptions: { ...viewOptions, ...options } })),
});
