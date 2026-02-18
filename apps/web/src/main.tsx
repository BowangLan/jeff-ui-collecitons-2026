import { scan } from "react-scan";
import { createRoot } from "react-dom/client";

scan({ enabled: true });
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RecreationConfig } from "./types/recreation";
import { RecreationPageWrapper } from "./components/recreation-page-wrapper";
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
      const RecreationComponent = mod.default;
      const config = mod.config;
      return {
        Component: () => (
          <RecreationPageWrapper slug={slug} config={config}>
            <RecreationComponent />
          </RecreationPageWrapper>
        ),
      };
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
