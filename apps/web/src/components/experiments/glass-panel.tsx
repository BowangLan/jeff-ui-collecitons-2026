import type { RecreationConfig } from "../../types/recreation";
import { GlassPanel1 } from "./glass-panel/glass-panel-1";

export const config = {
  name: "Glass Panel",
  description:
    "A glass transit dashboard with fleet metrics and service alerts.",
  author: "Jeff UI Collections",
  version: "1.0.0",
  url: "",
  license: "MIT",
  tags: ["experiment", "glass", "panel"],
  category: "experiments",
} satisfies RecreationConfig;

export default function GlassPanel() {
  return (
    <div className="flex flex-1 min-h-0 relative h-full w-full flex-col gap-5 p-4 text-gray-200 leading-tight sm:p-6">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      ></div>

      {/* add an overlay of black/50 */}
      <div className="absolute inset-0 z-0 bg-black/70"></div>

      <div className="relative z-10">
        <GlassPanel1 />
      </div>
    </div>
  );
}
