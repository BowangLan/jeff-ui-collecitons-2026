import { lazy } from "react";
import type { CollectionConfig } from "../../types/collection";

export const config = {
  name: "Linear",
  description: "An issue-tracking workspace study.",
  author: "Jeff UI Collections",
  version: "0.1.0",
  url: "https://linear.app",
  license: "MIT",
  tags: ["issue tracking"],
  category: "full-systems",
} satisfies CollectionConfig;

const LinearTaskPage = lazy(() =>
  import("./linear/pages/linear-tasks-page").then(({ LinearTaskPage }) => ({
    default: LinearTaskPage,
  })),
);

export default function Linear() {
  return <LinearTaskPage />;
}
