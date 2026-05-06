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
import type { CollectionConfig } from "./types/collection";
import { RecreationPageWrapper } from "./components/recreation-page-wrapper";
import "@fontsource-variable/inter";
import "./style.css";

type RecreationModule = {
  default: React.ComponentType;
  config: CollectionConfig;
};

type ExperimentModule = {
  default: React.ComponentType;
  config: CollectionConfig;
};

type DesignSystemModule = {
  default: React.ComponentType;
  config: CollectionConfig;
};

const recreationModules = import.meta.glob<RecreationModule>(
  "./components/recreations/*.tsx"
);

const experimentModules = import.meta.glob<ExperimentModule>(
  "./components/experiments/*.tsx"
);

const designSystemModules = import.meta.glob<DesignSystemModule>(
  "./components/design-systems/*.tsx"
);

const recreationConfigModules = import.meta.glob<{ config: CollectionConfig }>(
  "./components/recreations/*.tsx",
  { eager: true }
);

const experimentConfigModules = import.meta.glob<{ config: CollectionConfig }>(
  "./components/experiments/*.tsx",
  { eager: true }
);

const designSystemConfigModules = import.meta.glob<{ config: CollectionConfig }>(
  "./components/design-systems/*.tsx",
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

const experimentRoutes = Object.entries(experimentModules).map(([path, loader]) => {
  const slug = path.match(/([^/]+)\.tsx$/)?.[1] ?? "";
  const config = experimentConfigModules[path]?.config;

  if (!config) {
    throw new Error(`Missing config export for experiment module: ${path}`);
  }

  const ExperimentComponent = lazy(async () => {
    const mod = await loader();
    return { default: mod.default };
  });

  return createRoute({
    getParentRoute: () => rootRoute,
    path: `/experiments/${slug}`,
    component: () => (
      <RecreationPageWrapper slug={slug} config={config}>
        <Suspense fallback={null}>
          <ExperimentComponent />
        </Suspense>
      </RecreationPageWrapper>
    ),
  });
});

const designSystemRoutes = Object.entries(designSystemModules).map(([path, loader]) => {
  const slug = path.match(/([^/]+)\.tsx$/)?.[1] ?? "";
  const config = designSystemConfigModules[path]?.config;

  if (!config) {
    throw new Error(`Missing config export for design system module: ${path}`);
  }

  const DesignSystemComponent = lazy(async () => {
    const mod = await loader();
    return { default: mod.default };
  });

  return createRoute({
    getParentRoute: () => rootRoute,
    path: `/design-systems/${slug}`,
    component: () => (
      <RecreationPageWrapper slug={slug} config={config}>
        <Suspense fallback={null}>
          <DesignSystemComponent />
        </Suspense>
      </RecreationPageWrapper>
    ),
  });
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  ...recreationRoutes,
  ...experimentRoutes,
  ...designSystemRoutes,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("app")!).render(
  <RouterProvider router={router} />
);
