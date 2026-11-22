import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createFilterSlice, type FilterSlice } from "./slices/filter-slice";
import { createPanelSlice, type PanelSlice } from "./slices/panel-slice";
import { createTaskSlice, type TaskSlice } from "./slices/task-slice";
import { createViewSlice, type ViewSlice } from "./slices/view-slice";

export type LinearTaskStore = TaskSlice & FilterSlice & ViewSlice & PanelSlice;

export const useLinearTaskStore = create<LinearTaskStore>()(
  persist(
    (...args) => ({
      ...createTaskSlice(...args),
      ...createFilterSlice(...args),
      ...createViewSlice(...args),
      ...createPanelSlice(...args),
    }),
    {
      name: "linear-workspace-tasks",
      partialize: ({ data }) => ({ data }),
    },
  ),
);
