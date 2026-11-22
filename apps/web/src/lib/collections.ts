import type { ComponentType } from "react";
import type { CollectionConfig } from "../types/collection";

const modules = import.meta.glob<{
  default: ComponentType;
  config: CollectionConfig;
}>("../components/{recreations,experiments,full-systems}/*.tsx", {
  eager: true,
});

const sections = [
  { title: "Recreations", folder: "recreations", prefix: "" },
  { title: "Experiments", folder: "experiments", prefix: "/experiments" },
  { title: "Full Systems", folder: "full-systems", prefix: "/full-systems" },
];

export const collectionSections = sections.map(({ title, folder, prefix }) => ({
  title,
  items: Object.entries(modules)
    .filter(([file]) => file.startsWith(`../components/${folder}/`))
    .map(([file, { config, default: Component }]) => {
      const slug = file.slice(file.lastIndexOf("/") + 1, -".tsx".length);

      return {
        slug,
        path: `${prefix}/${slug}`,
        config,
        Component,
      };
    }),
}));
