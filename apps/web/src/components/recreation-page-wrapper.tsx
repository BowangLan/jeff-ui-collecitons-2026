import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { setPageMetadata } from "../lib/metadata";
import type { RecreationConfig } from "../types/recreation";

type RecreationPageWrapperProps = {
  slug: string;
  config: RecreationConfig;
  children: React.ReactNode;
};

export function RecreationPageWrapper({
  slug,
  config,
  children,
}: RecreationPageWrapperProps) {
  useEffect(() => {
    setPageMetadata({
      title: `${config.name} | UI Collections`,
      description: config.description,
    });
  }, [config.description, config.name]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal top bar: back link + title */}
      <header className="shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <span aria-hidden>←</span>
            <span>Collections</span>
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-right text-sm font-medium text-foreground">
            {config.name}
          </h1>
        </div>
      </header>

      {/* Recreation content: flex-1 so it fills remaining viewport */}
      <main className="flex flex-1 flex-col w-full mx-auto max-w-6xl">{children}</main>
    </div>
  );
}
