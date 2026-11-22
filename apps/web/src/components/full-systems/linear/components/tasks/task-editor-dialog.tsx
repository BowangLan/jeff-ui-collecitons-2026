import {
  controlButton,
  field,
  popup,
  primaryButton,
} from "../../lib/workspace-styles";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState, type FormEvent, type ReactElement } from "react";
import { toDateInput } from "../../lib/due-date";
import { useLinearTaskStore } from "../../store/use-linear-task-store";
import {
  TASK_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
} from "../../types";

type TaskEditorDialogProps = {
  children: ReactElement;
  task?: Task;
};

export function TaskEditorDialog({ children, task }: TaskEditorDialogProps) {
  const [open, setOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const title = titleInput.value.trim();

    if (!title) {
      titleInput.setCustomValidity("Enter an issue title.");
      titleInput.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const fields = {
      title,
      status: formData.get("status") as Task["status"],
      priority: formData.get("priority") as Task["priority"],
      labels: formData.get("labels") as Task["labels"],
      dueDate: (form.elements.namedItem("dueDate") as HTMLInputElement)
        .valueAsNumber,
    };
    const { createTask, updateTask, selectTask } =
      useLinearTaskStore.getState();

    if (task) {
      updateTask(task.code, fields);
    } else {
      selectTask(createTask(fields).code);
    }

    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-[#1e2e26]/45" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`${popup} fixed left-1/2 top-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-1/2 overflow-auto p-5`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <Dialog.Title className="text-lg font-semibold tracking-tight">
              {task ? `Edit ${task.code}` : "New issue"}
            </Dialog.Title>
            <Dialog.Close
              type="button"
              className={controlButton}
              aria-label="Close issue editor"
            >
              <X aria-hidden="true" size={16} />
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-x-3 gap-y-4 text-sm"
          >
            <label className="col-span-2 grid gap-1.5">
              Title
              <input
                className={field}
                name="title"
                required
                maxLength={160}
                defaultValue={task?.title}
                onInput={(event) => event.currentTarget.setCustomValidity("")}
              />
            </label>
            <label className="grid gap-1.5">
              Status
              <select
                className={field}
                name="status"
                defaultValue={task?.status ?? "Todo"}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              Priority
              <select
                className={field}
                name="priority"
                defaultValue={task?.priority ?? "Medium"}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              Label
              <select
                className={field}
                name="labels"
                defaultValue={task?.labels ?? "Improvement"}
              >
                {TASK_LABELS.map((label) => (
                  <option key={label}>{label}</option>
                ))}
              </select>
            </label>
            <label className="grid min-w-0 gap-1.5">
              Due date
              <input
                className={field}
                type="date"
                name="dueDate"
                required
                min="0001-01-01"
                max="9999-12-31"
                defaultValue={toDateInput(task?.dueDate ?? Date.now())}
              />
            </label>

            <div className="col-span-2 mt-1 flex justify-end gap-2">
              <Dialog.Close type="button" className={controlButton}>
                Cancel
              </Dialog.Close>
              <button type="submit" className={primaryButton}>
                {task ? "Save changes" : "Create issue"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
