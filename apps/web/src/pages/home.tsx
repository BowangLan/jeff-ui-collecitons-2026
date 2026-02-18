import { Link } from "react-router-dom";
import type { RecreationConfig } from "../types/recreation";

type RecreationMeta = {
  slug: string;
  config: RecreationConfig;
};

const modules = import.meta.glob<{ config: RecreationConfig }>(
  "../../components/recreations/*.tsx",
  { eager: true }
);

const recreations: RecreationMeta[] = Object.entries(modules).map(([path, mod]) => ({
  slug: path.match(/([^/]+)\.tsx$/)?.[1] ?? "",
  config: mod.config,
}));

export function Component() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">UI Collections</h1>
      <ul className="flex flex-col gap-4">
        {recreations.map(({ slug, config }) => (
          <li key={slug}>
            <Link to={`/${slug}`} className="block p-4 border rounded-lg hover:bg-gray-50">
              <div className="font-semibold">{config.name}</div>
              <div className="text-sm text-gray-500">{config.description}</div>
              <div className="text-xs text-gray-400 mt-1">{config.tags.join(", ")}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
