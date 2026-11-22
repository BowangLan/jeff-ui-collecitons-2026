import type { ServerResponse } from "node:http";
import type {
  QuoteFrame,
  StockQuote,
} from "../src/components/experiments/stock-chart/types";

const tickMs = 1000;

export function createQuoteFeed(catalogVersion: string, stocks: StockQuote[]) {
  const subscribers = new Set<ServerResponse>();
  const anchors = stocks.map(({ price }) => Math.round(price * 100));
  let timer: ReturnType<typeof setInterval> | undefined;
  let latestFrame = "";

  function publish() {
    const tick = Math.floor(Date.now() / tickMs);
    const pricesInCents = anchors.map((anchor, index) => {
      const phase = index * 0.67;
      const trend = Math.sin(tick / 37 + phase) * 0.009;
      const swing = Math.sin(tick / 11 + phase * 1.9) * 0.005;
      const seed = Math.imul(tick, 1664525) ^ Math.imul(index + 1, 1013904223);
      const sample = Math.imul(seed ^ (seed >>> 16), 2246822519) >>> 0;
      const noise = (sample / 2 ** 32 - 0.5) * 0.003;
      return Math.max(1, Math.round(anchor * (1 + trend + swing + noise)));
    });
    const frame: QuoteFrame = { catalogVersion, pricesInCents };
    latestFrame = `data: ${JSON.stringify(frame)}\n\n`;

    for (const response of subscribers) {
      // Each frame is a full snapshot, so a slow reader can skip a tick.
      if (!response.destroyed && !response.writableNeedDrain) {
        response.write(latestFrame);
      }
    }
  }

  return (response: ServerResponse) => {
    response.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    });
    response.flushHeaders();
    subscribers.add(response);

    response.once("close", () => {
      subscribers.delete(response);
      if (subscribers.size === 0) {
        clearInterval(timer);
        timer = undefined;
        latestFrame = "";
      }
    });

    if (timer) {
      response.write(latestFrame);
    } else {
      publish();
      timer = setInterval(publish, tickMs);
    }
  };
}
