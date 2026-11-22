import { scan } from "react-scan";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createRoute,
  createRootRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

import { RecreationPageWrapper } from "./components/recreation-page-wrapper";
import { collectionSections } from "./lib/collections";
import "@fontsource-variable/inter";
import "./style.css";

scan({ enabled: true });

const rootRoute = createRootRoute({
  component: Outlet,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./pages/home"), "Component"),
});

const collectionItems = collectionSections.flatMap(({ items }) => items);
const collectionRoutes = collectionItems.map(
  ({ slug, path, config, Component }) => {
    if (!config) {
      throw new Error(`Missing config export for collection route: ${path}`);
    }

    return createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => (
        <RecreationPageWrapper slug={slug} config={config}>
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        </RecreationPageWrapper>
      ),
    });
  },
);

const routeTree = rootRoute.addChildren([homeRoute, ...collectionRoutes]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("app")!).render(
  <RouterProvider router={router} />,
);
