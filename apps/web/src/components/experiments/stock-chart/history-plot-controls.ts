import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { usePriceHistory } from "./price-history-store";
import type { HistoryScope } from "./price-history-store";

type PointerSample = {
  pointerId: number;
  clientX: number;
  minX: number;
  maxX: number;
};

type PlotBounds = Pick<DOMRect, "left" | "width">;

function indexAt(clientX: number, { left, width }: PlotBounds, last: number) {
  return Math.max(
    0,
    Math.min(last, Math.round((last * (clientX - left)) / width)),
  );
}

function crossedSession(
  sample: PointerSample | null,
  bounds: PlotBounds,
  anchor: number,
  last: number,
) {
  return (
    sample !== null &&
    (indexAt(sample.minX, bounds, last) !== anchor ||
      indexAt(sample.maxX, bounds, last) !== anchor)
  );
}

export function useHistoryPlotControls(scope: HistoryScope, last: number) {
  const plotRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<PointerSample | null>(null);
  const { id, preset } = scope;

  const cancelFrame = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    pending.current = null;
  }, []);

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const isPlotEvent = (event: Event) => event.composedPath().includes(plot);
    let pointerStartedInPlot = false;

    function recordPointerOrigin(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return;
      pointerStartedInPlot = isPlotEvent(event);
    }

    function clearOnOutsideClick(event: MouseEvent) {
      // A click emitted after a chart drag can target an ancestor on release.
      if (isPlotEvent(event) || (event.detail > 0 && pointerStartedInPlot))
        return;
      const { chart, clearSelection } = usePriceHistory.getState();
      if (
        chart?.id === id &&
        chart.preset === preset &&
        chart.selection &&
        !chart.drag
      ) {
        clearSelection({ id, preset });
      }
    }

    const commitPointerRelease = (event: PointerEvent) => {
      const { chart, finishDrag } = usePriceHistory.getState();
      if (
        chart?.id !== id ||
        chart.preset !== preset ||
        chart.drag?.pointerId !== event.pointerId
      )
        return;

      const { drag } = chart;
      const bounds = plot.getBoundingClientRect();
      const crossed = crossedSession(
        pending.current,
        bounds,
        drag.anchor,
        last,
      );
      const extent = indexAt(event.clientX, bounds, last);
      const highlight =
        !drag.preview && !crossed && extent === drag.anchor
          ? plot
              .querySelector(".stocks-range-highlight")
              ?.getBoundingClientRect()
          : undefined;
      const outsideHighlight =
        !!highlight &&
        (event.clientX < highlight.left ||
          event.clientX > highlight.right ||
          event.clientY < highlight.top ||
          event.clientY > highlight.bottom);
      cancelFrame();
      finishDrag(
        { id, preset },
        event.pointerId,
        extent,
        crossed,
        outsideHighlight,
      );
    };

    document.addEventListener("pointerdown", recordPointerOrigin, true);
    document.addEventListener("pointerup", commitPointerRelease, true);
    document.addEventListener("click", clearOnOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", recordPointerOrigin, true);
      document.removeEventListener("pointerup", commitPointerRelease, true);
      document.removeEventListener("click", clearOnOutsideClick);
    };
  }, [id, preset, last, cancelFrame]);

  useLayoutEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  function getChart() {
    const chart = usePriceHistory.getState().chart;
    return chart?.id === scope.id && chart.preset === scope.preset
      ? chart
      : null;
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const drag = getChart()?.drag;
    if (drag && drag.pointerId !== event.pointerId) return;
    cancelFrame();
    const anchor = indexAt(
      event.clientX,
      event.currentTarget.getBoundingClientRect(),
      last,
    );
    event.currentTarget.setPointerCapture(event.pointerId);
    usePriceHistory.getState().beginDrag(scope, event.pointerId, anchor);
  }

  function trackPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = getChart()?.drag;
    if (
      !event.isPrimary ||
      (drag
        ? drag.pointerId !== event.pointerId
        : event.pointerType === "touch")
    )
      return;

    const element = event.currentTarget;
    const previous = pending.current;
    pending.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      minX: Math.min(event.clientX, previous?.minX ?? event.clientX),
      maxX: Math.max(event.clientX, previous?.maxX ?? event.clientX),
    };
    if (frame.current !== null) return;

    frame.current = requestAnimationFrame(() => {
      const sample = pending.current;
      frame.current = null;
      pending.current = null;
      if (!sample) return;
      const bounds = element.getBoundingClientRect();
      usePriceHistory
        .getState()
        .movePointer(
          scope,
          sample.pointerId,
          indexAt(sample.clientX, bounds, last),
          !!drag && crossedSession(sample, bounds, drag.anchor, last),
        );
    });
  }

  function cancelDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (getChart()?.drag?.pointerId !== event.pointerId) return;
    cancelFrame();
    usePriceHistory.getState().cancelDrag(scope, event.pointerId);
  }

  function loseCapture(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId))
      cancelDrag(event);
  }

  function clearSelection() {
    const drag = getChart()?.drag;
    cancelFrame();
    usePriceHistory.getState().clearSelection(scope);
    if (drag && plotRef.current?.hasPointerCapture(drag.pointerId)) {
      plotRef.current.releasePointerCapture(drag.pointerId);
    }
  }

  function trackKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const chart = getChart();
    if (!chart) return;
    const { selection } = chart;
    const cursor =
      event.shiftKey && selection
        ? selection.extent
        : (chart.cursorIndex ?? last);
    let nextIndex: number;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        nextIndex = Math.max(cursor - 1, 0);
        break;
      case "ArrowRight":
      case "ArrowUp":
        nextIndex = Math.min(cursor + 1, last);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = last;
        break;
      case "Escape":
        clearSelection();
        event.preventDefault();
        return;
      default:
        return;
    }
    event.preventDefault();
    usePriceHistory
      .getState()
      .moveCursor(
        scope,
        nextIndex,
        event.shiftKey ? (selection?.anchor ?? cursor) : undefined,
      );
  }

  function leavePlot() {
    if (getChart()?.drag) return;
    cancelFrame();
    usePriceHistory.getState().moveCursor(scope, null);
  }

  return {
    plotRef,
    startDrag,
    trackPointer,
    cancelDrag,
    loseCapture,
    clearSelection,
    leavePlot,
    trackKeyboard,
  };
}
