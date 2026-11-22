import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { stockChartApi } from "./server/stock-chart-api";

export default defineConfig({
  plugins: [react(), tailwindcss(), stockChartApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
