import { useMemo } from "react";
import { LinearAppSidebarLayout } from "../components/layout/linear-app-sidebar-layout";
import { LinearTopNav } from "../components/layout/linear-top-nav";
import { PageContainer } from "../components/layout/page-container";
import { LinearTaskPanel } from "../components/panels/linear-task-panel";
import { LinearTaskList } from "../components/tasks/linear-task-list";
import { LinearToolbarRow } from "../components/toolbar/linear-toolbar-row";
import { getVisibleTasks } from "../lib/task-list";
import { useLinearTaskStore } from "../store/use-linear-task-store";

export function LinearTaskPage() {
  const { groupBy, orderBy } = useLinearTaskStore((state) => state.viewOptions);
  const filters = useLinearTaskStore((state) => state.activeFilters);
  const taskData = useLinearTaskStore((state) => state.data);
  const visibleTasks = useMemo(
    () => getVisibleTasks(taskData, filters, orderBy),
    [taskData, filters, orderBy],
  );

  return (
    <PageContainer>
      <LinearAppSidebarLayout>
        <LinearTopNav title="My issues" />
        <LinearToolbarRow />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <LinearTaskPanel visibleTasks={visibleTasks} />
          <LinearTaskList
            tasks={visibleTasks}
            total={taskData.length}
            groupBy={groupBy}
          />
        </div>
      </LinearAppSidebarLayout>
    </PageContainer>
  );
}
