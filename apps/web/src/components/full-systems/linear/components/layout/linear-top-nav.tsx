import { primaryButton } from "../../lib/workspace-styles";
import { Plus } from "lucide-react";
import { TaskEditorDialog } from "../tasks/task-editor-dialog";

export function LinearTopNav({ title }: { title: string }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-6 md:pb-4 md:pt-6">
      <h2
        id="linear-page-title"
        className="text-2xl font-semibold tracking-tight md:text-[1.75rem]"
      >
        {title}
      </h2>
      <TaskEditorDialog>
        <button type="button" className={primaryButton}>
          <Plus aria-hidden="true" size={15} />
          New issue
        </button>
      </TaskEditorDialog>
    </header>
  );
}
