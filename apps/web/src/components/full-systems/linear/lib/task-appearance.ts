import type { TaskLabel } from "../types";

export const labelColors: Record<TaskLabel, { badge: string; dot: string }> = {
  Bug: { badge: "bg-[#f7e5e3] text-[#8f3930]", dot: "bg-[#e5a398]" },
  Design: { badge: "bg-[#eee7f7] text-[#64458a]", dot: "bg-[#c4a7e0]" },
  Feature: { badge: "bg-[#deeee4] text-[#306749]", dot: "bg-[#94c7a6]" },
  Improvement: { badge: "bg-[#e5edf6] text-[#3c5c83]", dot: "bg-[#9cbadd]" },
};
