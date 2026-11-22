import { create } from "zustand";
import type { StockCatalogResponse, StockHistory, StockQuote } from "./types";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type Bookmark = {
  value: boolean;
  confirmed: boolean;
  saving: boolean;
};

type Detail = StockHistory & { requestMs: number };

type StockChartState = {
  stocks: StockQuote[];
  stocksBySymbol: Record<string, StockQuote>;
  catalogVersion: string | null;
  listStatus: LoadStatus;
  selectedSymbol: string | null;
  detailStatus: LoadStatus;
  detailsBySymbol: Partial<Record<string, Detail>>;
  bookmarksBySymbol: Partial<Record<string, Bookmark>>;
  bookmarkError: string | null;
  loadStocks: () => Promise<void>;
  selectStock: (symbol: string, reload?: boolean) => Promise<void>;
  toggleBookmark: (symbol: string) => Promise<void>;
  dismissBookmarkError: () => void;
};

const endpoint = "/api/stock-chart";
const maxCachedHistories = 32;
let activeRequest: AbortController | undefined;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint + path, init);
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("application/json")
  ) {
    throw new Error("Stock API request failed.");
  }
  return response.json();
}

export const useStockChart = create<StockChartState>((set, get) => ({
  stocks: [],
  stocksBySymbol: {},
  catalogVersion: null,
  listStatus: "idle",
  selectedSymbol: null,
  detailStatus: "idle",
  detailsBySymbol: {},
  bookmarksBySymbol: {},
  bookmarkError: null,

  async loadStocks() {
    const { listStatus } = get();
    if (listStatus === "loading" || listStatus === "ready") return;
    set({ listStatus: "loading" });

    try {
      const result = await request<StockCatalogResponse>("/stocks");
      const stocks = result.stocks.map(
        ({
          symbol,
          name,
          sector,
          price,
          previousClose,
          changePercent,
          quoteIndex,
        }) => ({
          symbol,
          name,
          sector,
          price,
          previousClose,
          changePercent,
          quoteIndex,
        }),
      );
      const bookmarksBySymbol = Object.fromEntries(
        result.stocks
          .filter(({ bookmarked }) => bookmarked)
          .map(({ symbol }) => [
            symbol,
            { value: true, confirmed: true, saving: false },
          ]),
      );
      const stocksBySymbol = Object.fromEntries(
        stocks.map((stock) => [stock.symbol, stock]),
      );
      set({
        stocks,
        stocksBySymbol,
        catalogVersion: result.catalogVersion,
        listStatus: "ready",
        bookmarksBySymbol,
      });
      if (stocks.length) void get().selectStock(stocks[0].symbol);
    } catch {
      set({ listStatus: "error" });
    }
  },

  async selectStock(symbol, reload = false) {
    const { detailStatus, detailsBySymbol, selectedSymbol } = get();
    if (!reload && selectedSymbol === symbol && detailStatus !== "error")
      return;

    activeRequest?.abort();
    if (!reload && detailsBySymbol[symbol]) {
      activeRequest = undefined;
      set({ selectedSymbol: symbol, detailStatus: "ready" });
      return;
    }

    const controller = new AbortController();
    activeRequest = controller;
    set({ selectedSymbol: symbol, detailStatus: "loading" });

    const startedAt = performance.now();
    try {
      const history = await request<StockHistory>(`/stocks/${symbol}`, {
        signal: controller.signal,
      });
      if (activeRequest !== controller) return;
      const requestMs = Math.round(performance.now() - startedAt);
      set((state) => {
        const detailsBySymbol = { ...state.detailsBySymbol };
        delete detailsBySymbol[symbol];
        detailsBySymbol[symbol] = { ...history, requestMs };
        const symbols = Object.keys(detailsBySymbol);
        if (symbols.length > maxCachedHistories)
          delete detailsBySymbol[symbols[0]];
        return { detailStatus: "ready", detailsBySymbol };
      });
    } catch {
      if (activeRequest === controller) set({ detailStatus: "error" });
    } finally {
      if (activeRequest === controller) activeRequest = undefined;
    }
  },

  async toggleBookmark(symbol) {
    const { stocksBySymbol, bookmarksBySymbol } = get();
    if (!stocksBySymbol[symbol]) return;
    const initial = bookmarksBySymbol[symbol] ?? {
      value: false,
      confirmed: false,
      saving: false,
    };

    let desired = !initial.value;
    let confirmed = initial.confirmed;
    set((state) => ({
      bookmarkError: null,
      bookmarksBySymbol: {
        ...state.bookmarksBySymbol,
        [symbol]: { value: desired, confirmed, saving: true },
      },
    }));
    if (initial.saving) return;

    // Each symbol has one writer. Clicks during a save update its next desired value.
    let error: string | undefined;
    try {
      while (desired !== confirmed) {
        const result = await request<{ bookmarked: boolean }>(
          `/bookmarks/${symbol}`,
          { method: desired ? "PUT" : "DELETE" },
        );
        confirmed = result.bookmarked;
        desired = get().bookmarksBySymbol[symbol]?.value ?? false;
      }
    } catch {
      error = `Couldn’t save the bookmark change for ${symbol}. Try again.`;
    }

    set((state) => {
      const bookmarksBySymbol = { ...state.bookmarksBySymbol };
      if (confirmed) {
        bookmarksBySymbol[symbol] = {
          value: true,
          confirmed: true,
          saving: false,
        };
      } else {
        delete bookmarksBySymbol[symbol];
      }
      return { bookmarkError: error ?? state.bookmarkError, bookmarksBySymbol };
    });
  },

  dismissBookmarkError: () => set({ bookmarkError: null }),
}));
