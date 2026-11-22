import { create } from "zustand";

export const historyRanges = [
  { label: "1M", sessions: 22 },
  { label: "3M", sessions: 66 },
  { label: "1Y", sessions: 252 },
  { label: "All", sessions: Infinity },
] as const;

type Preset = (typeof historyRanges)[number]["label"];
export type HistoryScope = { id: string; preset: Preset };
type Selection = { anchor: number; extent: number };
type Drag = {
  pointerId: number;
  anchor: number;
  preview: Selection | null;
};
type ChartSession = HistoryScope & {
  cursorIndex: number | null;
  selection: Selection | null;
  drag: Drag | null;
};

type PriceHistoryState = {
  chart: ChartSession | null;
  openChart: (id: string) => void;
  closeChart: (id: string) => void;
  setPreset: (id: string, preset: Preset) => void;
  beginDrag: (scope: HistoryScope, pointerId: number, anchor: number) => void;
  movePointer: (
    scope: HistoryScope,
    pointerId: number,
    index: number,
    crossedSession: boolean,
  ) => void;
  finishDrag: (
    scope: HistoryScope,
    pointerId: number,
    extent: number,
    crossedSession: boolean,
    outsideHighlight?: boolean,
  ) => void;
  cancelDrag: (scope: HistoryScope, pointerId: number) => void;
  moveCursor: (
    scope: HistoryScope,
    index: number | null,
    selectionAnchor?: number,
  ) => void;
  clearSelection: (scope: HistoryScope) => void;
};

const emptyInteraction = { cursorIndex: null, selection: null, drag: null };

function dragSelection(drag: Drag, extent: number, crossedSession: boolean) {
  return drag.preview || extent !== drag.anchor || crossedSession
    ? { anchor: drag.anchor, extent }
    : null;
}

function containsSession(selection: Selection, index: number) {
  return (
    index >= Math.min(selection.anchor, selection.extent) &&
    index <= Math.max(selection.anchor, selection.extent)
  );
}

export const usePriceHistory = create<PriceHistoryState>((set) => {
  function updatePlot(
    scope: HistoryScope,
    update: (chart: ChartSession) => Partial<ChartSession> | undefined,
  ) {
    set((state) => {
      const chart = state.chart;
      if (chart?.id !== scope.id || chart.preset !== scope.preset) return state;
      const patch = update(chart);
      return patch ? { chart: { ...chart, ...patch } } : state;
    });
  }

  return {
    chart: null,
    openChart: (id) =>
      set({ chart: { id, preset: "All", ...emptyInteraction } }),
    closeChart: (id) =>
      set((state) => (state.chart?.id === id ? { chart: null } : state)),
    setPreset: (id, preset) =>
      set((state) => {
        if (state.chart?.id !== id || state.chart.preset === preset)
          return state;
        return { chart: { id, preset, ...emptyInteraction } };
      }),
    beginDrag: (scope, pointerId, anchor) =>
      updatePlot(scope, (chart) => {
        if (chart.drag && chart.drag.pointerId !== pointerId) return;
        return {
          cursorIndex: anchor,
          drag: { pointerId, anchor, preview: null },
        };
      }),
    movePointer: (scope, pointerId, index, crossedSession) =>
      updatePlot(scope, (chart) => {
        const { drag, cursorIndex } = chart;
        if (!drag)
          return index === cursorIndex ? undefined : { cursorIndex: index };
        if (drag.pointerId !== pointerId) return;
        const preview = dragSelection(drag, index, crossedSession);
        if (index === cursorIndex && preview?.extent === drag.preview?.extent)
          return;
        return { cursorIndex: index, drag: { ...drag, preview } };
      }),
    finishDrag: (
      scope,
      pointerId,
      extent,
      crossedSession,
      outsideHighlight = false,
    ) =>
      updatePlot(scope, (chart) => {
        const { drag } = chart;
        if (drag?.pointerId !== pointerId) return;
        const selection =
          dragSelection(drag, extent, crossedSession) ??
          (!outsideHighlight &&
          chart.selection &&
          containsSession(chart.selection, extent)
            ? chart.selection
            : null);
        return { cursorIndex: extent, selection, drag: null };
      }),
    cancelDrag: (scope, pointerId) =>
      updatePlot(scope, (chart) =>
        chart.drag?.pointerId === pointerId
          ? { cursorIndex: null, drag: null }
          : undefined,
      ),
    moveCursor: (scope, index, selectionAnchor) =>
      updatePlot(scope, (chart) => {
        if (chart.drag) return;
        if (index !== null && selectionAnchor !== undefined) {
          return {
            cursorIndex: index,
            selection: { anchor: selectionAnchor, extent: index },
          };
        }
        return index !== chart.cursorIndex ? { cursorIndex: index } : undefined;
      }),
    clearSelection: (scope) =>
      updatePlot(scope, () => ({ selection: null, drag: null })),
  };
});
