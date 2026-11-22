import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { collectionSections } from "../lib/collections";
import { setPageMetadata } from "../lib/metadata";

const description =
  "A curated set of UI recreations, interface experiments, and full systems.";

export function Component() {
  useEffect(() => {
    setPageMetadata({ title: "UI Collections", description });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          UI Collections
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        {collectionSections.map(({ title, items }) =>
          items.length > 0 ? (
            <section key={title} className="mt-10">
              <h2 className="text-base text-foreground">{title}</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {items.map(({ path, config }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="group flex cursor-pointer flex-col gap-1 rounded-lg border border-border bg-card/50 px-4 py-3.5 transition-colors duration-200 hover:border-border/80 hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    >
                      <div className="font-medium text-foreground">
                        {config.name}
                      </div>
                      <div className="text-sm leading-relaxed text-muted-foreground">
                        {config.description}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {config.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted/80 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )}
      </div>
    </main>
  );
}
