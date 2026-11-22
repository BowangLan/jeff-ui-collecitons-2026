import type { ReactNode } from "react";
import { LinearSidebar } from "./linear-sidebar";

export function LinearAppSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LinearSidebar />
      <section
        aria-labelledby="linear-page-title"
        className="flex min-h-0 min-w-0 flex-1 flex-col"
      >
        {children}
      </section>
    </>
  );
}
