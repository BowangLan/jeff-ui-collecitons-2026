import type { StateCreator } from "zustand";
import type { Task } from "../../types";
import type { LinearTaskStore } from "../use-linear-task-store";

type Panel = "insights" | "details";

export type PanelSlice = {
  activePanel: Panel | null;
  selectedTaskCode: Task["code"] | null;
  selectTask: (code: Task["code"]) => void;
  togglePanel: (panel: Panel) => void;
  closePanel: () => void;
};

export const createPanelSlice: StateCreator<
  LinearTaskStore,
  [],
  [],
  PanelSlice
> = (set) => ({
  activePanel: null,
  selectedTaskCode: null,
  selectTask: (code) => set({ selectedTaskCode: code, activePanel: "details" }),
  togglePanel: (panel) =>
    set(({ activePanel }) => ({
      activePanel: activePanel === panel ? null : panel,
    })),
  closePanel: () => set({ activePanel: null }),
});
