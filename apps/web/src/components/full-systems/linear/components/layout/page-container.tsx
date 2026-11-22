import { workspaceSurface } from "../../lib/workspace-styles";
import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${workspaceSurface} flex h-[calc(100dvh-45px)] min-h-[32rem] flex-col border-x border-[var(--linear-rule)] text-sm md:flex-row`}
    >
      {children}
    </div>
  );
}
