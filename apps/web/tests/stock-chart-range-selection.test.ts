import { afterEach, expect, test } from "bun:test";
import { usePriceHistory } from "../src/components/experiments/stock-chart/price-history-store";

const scope = { id: "stock-chart-test", preset: "All" } as const;
const pointer = 1;
const store = usePriceHistory.getState();

afterEach(() => store.closeChart(scope.id));

test("a short consecutive drag replaces the range even without a preview frame", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 500, false);

  store.beginDrag(scope, pointer, 350);
  store.finishDrag(scope, pointer, 352, false);

  expect(usePriceHistory.getState().chart).toMatchObject({
    selection: { anchor: 350, extent: 352 },
    cursorIndex: 352,
    drag: null,
  });
});

test("a new press from the same pointer replaces an unfinished drag", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 100);
  store.movePointer(scope, pointer, 150, false);

  store.beginDrag(scope, pointer, 300);
  expect(usePriceHistory.getState().chart?.selection).toEqual({
    anchor: 100,
    extent: 150,
  });
  store.finishDrag(scope, pointer, 280, false);

  expect(usePriceHistory.getState().chart?.selection).toEqual({
    anchor: 300,
    extent: 280,
  });
});

test("an interruption commits the visible preview and ignores a late release", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 500, false);

  store.beginDrag(scope, pointer, 350);
  store.movePointer(scope, pointer, 250, false);
  store.interruptDrag(scope, pointer);
  store.finishDrag(scope, pointer, 200, false);

  expect(usePriceHistory.getState().chart).toMatchObject({
    selection: { anchor: 350, extent: 250 },
    cursorIndex: 250,
    drag: null,
  });
});

test("an interruption before a preview leaves the committed range in place", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 500, false);

  store.beginDrag(scope, pointer, 750);
  store.interruptDrag(scope, pointer);

  expect(usePriceHistory.getState().chart).toMatchObject({
    selection: { anchor: 100, extent: 500 },
    drag: null,
  });
});

test("a tap inside the range preserves it and a drag back to its anchor selects one session", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 500, false);

  store.beginDrag(scope, pointer, 350);
  store.finishDrag(scope, pointer, 350, false);
  expect(usePriceHistory.getState().chart?.selection).toEqual({
    anchor: 100,
    extent: 500,
  });

  store.beginDrag(scope, pointer, 350);
  store.finishDrag(scope, pointer, 350, true);
  expect(usePriceHistory.getState().chart?.selection).toEqual({
    anchor: 350,
    extent: 350,
  });
});

test("a tap outside a reversed range clears it", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 500);
  store.finishDrag(scope, pointer, 100, false);

  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 100, false);
  expect(usePriceHistory.getState().chart?.selection).toEqual({
    anchor: 500,
    extent: 100,
  });

  store.beginDrag(scope, pointer, 750);
  store.finishDrag(scope, pointer, 750, false);
  expect(usePriceHistory.getState().chart?.selection).toBeNull();
});

test("a click just outside the highlight clears it even if it rounds to the boundary session", () => {
  store.openChart(scope.id);
  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 500, false);

  store.beginDrag(scope, pointer, 100);
  store.finishDrag(scope, pointer, 100, false, true);
  expect(usePriceHistory.getState().chart?.selection).toBeNull();
});
