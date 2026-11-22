import type { StateCreator } from "zustand";
import { initialTasks } from "../../lib/data";
import type { Task } from "../../types";
import type { LinearTaskStore } from "../use-linear-task-store";

export type TaskFields = Omit<Task, "code">;

export type TaskSlice = {
  data: Task[];
  createTask: (fields: TaskFields) => Task;
  updateTask: (code: Task["code"], fields: TaskFields) => void;
};

export const createTaskSlice: StateCreator<
  LinearTaskStore,
  [],
  [],
  TaskSlice
> = (set, get) => ({
  data: initialTasks,
  createTask: (fields) => {
    const { data } = get();
    const lastIssueNumber = data.reduce(
      (highest, task) =>
        Math.max(highest, Number(task.code.slice("STU-".length))),
      0,
    );
    const task: Task = { ...fields, code: `STU-${lastIssueNumber + 1}` };
    set({ data: [task, ...data] });
    return task;
  },
  updateTask: (code, fields) =>
    set(({ data }) => ({
      data: data.map((task) =>
        task.code === code ? { ...task, ...fields } : task,
      ),
    })),
});
