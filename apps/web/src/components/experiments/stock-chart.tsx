import { lazy } from "react";
import type { CollectionConfig } from "../../types/collection";

export const config = {
  name: "Stock Chart",
  description:
    "A stock watchlist with optimistic bookmarks and intentionally slow historical data.",
  author: "Jeff UI Collections",
  version: "1.0.0",
  url: "",
  license: "MIT",
  tags: ["Zustand", "SQLite", "data loading"],
  category: "experiments",
} satisfies CollectionConfig;

const StockChart = lazy(() => import("./stock-chart/stock-chart"));

export default function StockChartRoute() {
  return <StockChart />;
}
