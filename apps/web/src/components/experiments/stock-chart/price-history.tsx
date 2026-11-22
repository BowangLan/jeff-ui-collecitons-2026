import { memo, useId, useLayoutEffect, useMemo } from "react";
import { formatPrice } from "./format";
import { useHistoryPlotControls } from "./history-plot-controls";
import { historyRanges, usePriceHistory } from "./price-history-store";
import type { HistoryScope } from "./price-history-store";
import type { PricePoint } from "./types";

const axisCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const tickDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function rangeStats(points: PricePoint[], start: number, end: number) {
  let low = Infinity;
  let high = -Infinity;
  for (let index = start; index <= end; index++) {
    const close = points[index].close;
    low = Math.min(low, close);
    high = Math.max(high, close);
  }
  return { low, high };
}

function buildPlot(points: PricePoint[]) {
  const { low, high } = rangeStats(points, 0, points.length - 1);
  const span = high - low || 1;
  const ceiling = high + span * 0.1;
  const floor = low - span * 0.1;
  const y = (close: number) => (ceiling - close) / (ceiling - floor);
  const last = points.length - 1;
  const line = points
    .map(
      ({ close }, index) =>
        `${((1000 * index) / last).toFixed(1)},${(300 * y(close)).toFixed(1)}`,
    )
    .join(" ");
  const levels = Array.from(
    { length: 5 },
    (_, index) => ceiling - (index * (ceiling - floor)) / 4,
  );
  const dates = [0, Math.round(last / 3), Math.round((2 * last) / 3), last].map(
    (index) => tickDate.format(new Date(points[index].date)),
  );

  return { line, levels, dates, y, low, high };
}

export default function PriceHistory({ points }: { points: PricePoint[] }) {
  const id = useId();
  const preset = usePriceHistory((state) =>
    state.chart?.id === id ? state.chart.preset : "All",
  );
  const range =
    historyRanges.find((option) => option.label === preset) ?? historyRanges[3];

  useLayoutEffect(() => {
    usePriceHistory.getState().openChart(id);
    return () => usePriceHistory.getState().closeChart(id);
  }, [id]);
  const visible = useMemo(
    () =>
      range.sessions >= points.length ? points : points.slice(-range.sessions),
    [points, range],
  );
  const plot = useMemo(() => buildPlot(visible), [visible]);

  return (
    <>
      <div className="stocks-chart-toolbar">
        <h3>Price history</h3>
        <div className="stocks-ranges" role="group" aria-label="Chart range">
          {historyRanges.map((option) => (
            <button
              type="button"
              key={option.label}
              aria-pressed={preset === option.label}
              disabled={
                option.label !== "All" && option.sessions >= points.length
              }
              onClick={() =>
                usePriceHistory.getState().setPreset(id, option.label)
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <HistoryPlot
        key={preset}
        scope={{ id, preset }}
        points={visible}
        plot={plot}
      />
    </>
  );
}

const PriceSeries = memo(function PriceSeries({
  plot,
}: {
  plot: ReturnType<typeof buildPlot>;
}) {
  return (
    <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
      {plot.levels.map((level, tick) => (
        <line
          key={level}
          x1="0"
          x2="1000"
          y1={tick * 75}
          y2={tick * 75}
          className="stocks-grid-line"
        />
      ))}
      <polygon points={`0,300 ${plot.line} 1000,300`} className="stocks-area" />
      <polyline points={plot.line} className="stocks-series" />
    </svg>
  );
});

function HistoryPlot({
  scope,
  points,
  plot,
}: {
  scope: HistoryScope;
  points: PricePoint[];
  plot: ReturnType<typeof buildPlot>;
}) {
  const last = points.length - 1;
  const { id, preset } = scope;
  const index = usePriceHistory((state) => {
    const chart = state.chart;
    return chart?.id === id && chart.preset === preset
      ? chart.cursorIndex
      : null;
  });
  const activeSelection = usePriceHistory((state) => {
    const chart = state.chart;
    return chart?.id === id && chart.preset === preset
      ? (chart.drag?.preview ?? chart.selection)
      : null;
  });
  const controls = useHistoryPlotControls(scope, last);
  const hintId = useId();
  const activeIndex = index ?? last;
  const point = points[activeIndex];
  const x = (100 * activeIndex) / last;
  const y = 100 * plot.y(point.close);
  const selectedDate = fullDate.format(new Date(point.date));
  const start = activeSelection
    ? Math.min(activeSelection.anchor, activeSelection.extent)
    : 0;
  const end = activeSelection
    ? Math.max(activeSelection.anchor, activeSelection.extent)
    : last;
  const stats = useMemo(
    () =>
      start === 0 && end === last
        ? { low: plot.low, high: plot.high }
        : rangeStats(points, start, end),
    [points, start, end, last, plot],
  );
  const selectionLabel = activeSelection
    ? fullDate.formatRange(
        new Date(points[start].date),
        new Date(points[end].date),
      )
    : null;

  return (
    <>
      <div className="stocks-chart">
        <div className="stocks-chart-readout" aria-hidden="true">
          <span>{selectedDate}</span>
          <strong>{formatPrice(point.close)}</strong>
        </div>
        <div className="stocks-chart-grid">
          <div
            ref={controls.plotRef}
            className="stocks-plot"
            role="slider"
            tabIndex={0}
            aria-label="Historical closing price by trading session"
            aria-valuemin={1}
            aria-valuemax={points.length}
            aria-valuenow={activeIndex + 1}
            aria-describedby={hintId}
            aria-valuetext={`${selectedDate}, ${formatPrice(point.close)}${selectionLabel ? `, selected range ${selectionLabel}` : ""}`}
            onPointerMove={controls.trackPointer}
            onPointerDown={controls.startDrag}
            onPointerCancel={controls.cancelDrag}
            onLostPointerCapture={controls.loseCapture}
            onPointerLeave={controls.leavePlot}
            onKeyDown={controls.trackKeyboard}
          >
            <PriceSeries plot={plot} />
            {activeSelection && (
              <div className="stocks-range-overlay" aria-hidden="true">
                <span
                  className="stocks-range-dim"
                  style={{ width: `${(100 * start) / last}%` }}
                />
                <span
                  className="stocks-range-highlight"
                  style={{ width: `${(100 * (end - start)) / last}%` }}
                />
                <span
                  className="stocks-range-dim"
                  style={{ width: `${(100 * (last - end)) / last}%` }}
                />
              </div>
            )}
            {index !== null && (
              <span className="stocks-crosshair" style={{ left: `${x}%` }} />
            )}
            <span
              className="stocks-point"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          </div>
          <div className="stocks-price-axis" aria-hidden="true">
            {plot.levels.map((price) => (
              <span key={price}>{axisCurrency.format(price)}</span>
            ))}
          </div>
          <div className="stocks-date-axis" aria-hidden="true">
            {plot.dates.map((date, index) => (
              <span key={index}>{date}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="stocks-selection-bar">
        <div className="stocks-selection-label">
          {selectionLabel ? (
            <>
              <span className="stocks-selection-swatch" aria-hidden="true" />
              <span>
                <span className="sr-only">Selected range </span>
                {selectionLabel}
              </span>
            </>
          ) : (
            <span>Drag to select a range</span>
          )}
        </div>
        {selectionLabel && (
          <button
            type="button"
            onClick={() => {
              controls.clearSelection();
              controls.plotRef.current?.focus({ preventScroll: true });
            }}
          >
            Clear selection
          </button>
        )}
        <span className="sr-only" id={hintId}>
          Use the arrow keys to inspect a session. Hold Shift with the arrow
          keys to select a range. Click outside the selected range or press
          Escape to clear it.
        </span>
      </div>
      <dl className="stocks-chart-stats">
        <div>
          <dt>Range low</dt>
          <dd>{formatPrice(stats.low)}</dd>
        </div>
        <div>
          <dt>Range high</dt>
          <dd>{formatPrice(stats.high)}</dd>
        </div>
        <div>
          <dt>{activeSelection ? "Sessions selected" : "Sessions shown"}</dt>
          <dd>{(end - start + 1).toLocaleString("en-US")}</dd>
        </div>
      </dl>
    </>
  );
}
