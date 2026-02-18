import { scan } from "react-scan";
import { createRoot } from "react-dom/client";

scan({ enabled: true });
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RecreationConfig } from "./types/recreation";
import "@fontsource-variable/inter";
import "./style.css";

type RecreationModule = {
  default: React.ComponentType;
  config: RecreationConfig;
};

const recreationModules = import.meta.glob<RecreationModule>(
  "./components/recreations/*.tsx"
);

const recreationRoutes = Object.entries(recreationModules).map(([path, loader]) => {
  const slug = path.match(/([^/]+)\.tsx$/)?.[1] ?? "";
  return {
    path: `/${slug}`,
    lazy: async () => {
      const mod = await loader();
      return { Component: mod.default };
    },
  };
});

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/home"),
  },
  ...recreationRoutes,
]);

createRoot(document.getElementById("app")!).render(
  <RouterProvider router={router} />
);
