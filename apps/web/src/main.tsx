import { scan } from "react-scan";
import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  createRoute,
  createRootRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

scan({ enabled: true });
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

const recreationConfigModules = import.meta.glob<{ config: RecreationConfig }>(
  "./components/recreations/*.tsx",
  { eager: true }
);

const rootRoute = createRootRoute({
  component: Outlet,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./pages/home"), "Component"),
});

const recreationRoutes = Object.entries(recreationModules).map(([path, loader]) => {
  const slug = path.match(/([^/]+)\.tsx$/)?.[1] ?? "";
  const config = recreationConfigModules[path]?.config;

  if (!config) {
    throw new Error(`Missing config export for recreation module: ${path}`);
  }

  const RecreationComponent = lazy(async () => {
    const mod = await loader();
    return { default: mod.default };
  });

  return createRoute({
    getParentRoute: () => rootRoute,
    path: `/${slug}`,
    component: () => (
      <RecreationPageWrapper slug={slug} config={config}>
        <Suspense fallback={null}>
          <RecreationComponent />
        </Suspense>
      </RecreationPageWrapper>
    ),
  });
});

const routeTree = rootRoute.addChildren([homeRoute, ...recreationRoutes]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("app")!).render(
  <RouterProvider router={router} />
);
