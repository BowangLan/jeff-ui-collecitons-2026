import { create } from "zustand";
import type { QuoteFrame } from "./types";

type QuoteFeedStatus = "connecting" | "live" | "reconnecting" | "unavailable";

export const useLiveQuotes = create<{
  catalogVersion: string | null;
  pricesInCents: number[];
  status: QuoteFeedStatus;
}>(() => ({ catalogVersion: null, pricesInCents: [], status: "connecting" }));

export function connectLiveQuotes(catalogVersion: string, stockCount: number) {
  useLiveQuotes.setState((state) => ({
    catalogVersion,
    pricesInCents:
      state.catalogVersion === catalogVersion ? state.pricesInCents : [],
    status: "connecting",
  }));
  const stream = new EventSource("/api/stock-chart/quotes");

  stream.onmessage = (event: MessageEvent<string>) => {
    try {
      const frame: Partial<QuoteFrame> | null = JSON.parse(event.data);
      if (
        frame?.catalogVersion === catalogVersion &&
        Array.isArray(frame.pricesInCents) &&
        frame.pricesInCents.length === stockCount
      ) {
        useLiveQuotes.setState({
          pricesInCents: frame.pricesInCents,
          status: "live",
        });
        return;
      }
    } catch {
      // Keep the last successful snapshot if a frame can't be parsed.
    }
    useLiveQuotes.setState({ status: "unavailable" });
  };

  stream.onerror = () => {
    useLiveQuotes.setState({
      status:
        stream.readyState === EventSource.CLOSED
          ? "unavailable"
          : "reconnecting",
    });
  };

  return () => {
    stream.onmessage = null;
    stream.onerror = null;
    stream.close();
  };
}
