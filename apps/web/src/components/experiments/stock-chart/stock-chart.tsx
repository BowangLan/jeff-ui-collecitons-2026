import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  RotateCw,
  Search,
} from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useShallow } from "zustand/react/shallow";
import PriceHistory from "./price-history";
import { formatPrice } from "./format";
import { connectLiveQuotes, useLiveQuotes } from "./live-quotes";
import { useStockChart } from "./store";
import type { StockQuote } from "./types";
import "./stock-chart.css";

const rowHeight = 58;
const overscan = 5;
const countFormat = new Intl.NumberFormat("en-US");

function QuoteChange({ value }: { value: number }) {
  const Icon = value < 0 ? ArrowDownRight : ArrowUpRight;
  return (
    <span className="stocks-change" data-direction={value < 0 ? "down" : "up"}>
      <Icon size={14} aria-hidden="true" />
      {value >= 0 ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

const StockPrice = memo(function StockPrice({
  stock,
  detail = false,
}: {
  stock: StockQuote;
  detail?: boolean;
}) {
  const cents = useLiveQuotes((state) => state.pricesInCents[stock.quoteIndex]);
  const price = cents === undefined ? stock.price : cents / 100;
  const changePercent =
    cents === undefined
      ? stock.changePercent
      : Math.round(10000 * (price / stock.previousClose - 1)) / 100;

  return (
    <span
      id={detail ? undefined : `stock-quote-${stock.symbol}`}
      className={detail ? "stocks-quote" : "stocks-row-price"}
    >
      <strong>{formatPrice(price)}</strong>
      <QuoteChange value={changePercent} />
    </span>
  );
});

const feedLabels = {
  connecting: "Connecting quotes",
  live: "Live simulation",
  reconnecting: "Reconnecting quotes",
  unavailable: "Quote feed unavailable",
};

function QuoteFeedStatus() {
  const [enabled, setEnabled] = useState(true);
  const catalogVersion = useStockChart((state) => state.catalogVersion);
  const stockCount = useStockChart((state) => state.stocks.length);
  const status = useLiveQuotes((state) => state.status);

  useEffect(() => {
    if (!enabled || !catalogVersion) return;
    return connectLiveQuotes(catalogVersion, stockCount);
  }, [enabled, catalogVersion, stockCount]);

  return (
    <div className="stocks-simulation">
      <span className="stocks-feed-info">
        <span
          className="stocks-feed-label"
          data-live={enabled && !!catalogVersion && status === "live"}
          role="status"
        >
          {!enabled
            ? "Feed paused"
            : catalogVersion
              ? feedLabels[status]
              : "Simulated prices"}
        </span>
        <span aria-hidden="true">/</span> USD
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className="stocks-feed-toggle"
        onClick={() => setEnabled((current) => !current)}
      >
        <span className="stocks-feed-track" aria-hidden="true" />
        Live feed
      </button>
    </div>
  );
}

function BookmarkButton({
  symbol,
  withLabel = false,
}: {
  symbol: string;
  withLabel?: boolean;
}) {
  const bookmarked = useStockChart(
    (state) => state.bookmarksBySymbol[symbol]?.value ?? false,
  );
  const toggleBookmark = useStockChart((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={
        withLabel
          ? "stocks-bookmark stocks-bookmark-labeled"
          : "stocks-bookmark"
      }
      aria-label={`Bookmark ${symbol}`}
      aria-pressed={bookmarked}
      title={bookmarked ? `Remove ${symbol} bookmark` : `Bookmark ${symbol}`}
      onClick={() => void toggleBookmark(symbol)}
    >
      <Bookmark
        size={16}
        fill={bookmarked ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {withLabel && <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>}
    </button>
  );
}

function BookmarkFeedback() {
  const error = useStockChart((state) => state.bookmarkError);
  const dismiss = useStockChart((state) => state.dismissBookmarkError);
  if (!error) return null;

  return (
    <div className="stocks-bookmark-error">
      <span role="alert">{error}</span>
      <button type="button" onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
}

const StockRow = memo(function StockRow({
  stock,
  detailRef,
  index,
  count,
}: {
  stock: StockQuote;
  detailRef: RefObject<HTMLElement | null>;
  index: number;
  count: number;
}) {
  const { symbol, name } = stock;
  const selected = useStockChart((state) => state.selectedSymbol === symbol);
  const selectStock = useStockChart((state) => state.selectStock);

  return (
    <li
      className="stocks-row"
      data-symbol={symbol}
      data-selected={selected}
      data-last={index === count - 1}
      aria-posinset={index + 1}
      aria-setsize={count}
      style={{ top: index * rowHeight, height: rowHeight }}
    >
      <button
        type="button"
        className="stocks-row-select"
        aria-pressed={selected}
        aria-label={`Show ${symbol}, ${name}`}
        aria-describedby={`stock-quote-${symbol}`}
        aria-controls="stock-chart-detail"
        onClick={() => {
          void selectStock(symbol);
          if (window.matchMedia("(max-width: 760px)").matches) {
            detailRef.current?.scrollIntoView({ block: "start" });
          }
        }}
      >
        <span className="stocks-row-name">
          <strong>{symbol}</strong>
          <span>{name}</span>
        </span>
        <StockPrice stock={stock} />
      </button>
      <BookmarkButton symbol={symbol} />
    </li>
  );
});

function StockResults({
  stocks,
  detailRef,
}: {
  stocks: StockQuote[];
  detailRef: RefObject<HTMLElement | null>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(470);
  const [firstVisible, setFirstVisible] = useState(0);
  const [focusedSymbol, setFocusedSymbol] = useState<string>();

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() =>
      setViewportHeight(viewport.clientHeight),
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const focusedIndex = useMemo(
    () =>
      focusedSymbol
        ? stocks.findIndex(({ symbol }) => symbol === focusedSymbol)
        : -1,
    [focusedSymbol, stocks],
  );
  const viewportRows = Math.ceil(viewportHeight / rowHeight) + 1;
  const first = Math.min(
    firstVisible,
    Math.max(0, stocks.length - viewportRows + 1),
  );
  const start = Math.max(0, first - overscan);
  const end = Math.min(stocks.length, first + viewportRows + overscan);
  const indices = Array.from(
    { length: end - start },
    (_, offset) => start + offset,
  );
  // Retain a focused row while scrolling so keyboard focus stays on its control.
  if (focusedIndex >= 0 && focusedIndex < start) indices.unshift(focusedIndex);
  if (focusedIndex >= end) indices.push(focusedIndex);

  return (
    <div
      ref={viewportRef}
      className="stocks-results"
      role="region"
      aria-label="Stock results"
      tabIndex={0}
      onScroll={(event) =>
        setFirstVisible(Math.floor(event.currentTarget.scrollTop / rowHeight))
      }
      onFocus={(event) =>
        setFocusedSymbol(
          event.target.closest<HTMLElement>("[data-symbol]")?.dataset.symbol,
        )
      }
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocusedSymbol(undefined);
      }}
    >
      <ul
        className="stocks-rows"
        role="list"
        style={{ height: stocks.length * rowHeight }}
      >
        {indices.map((index) => (
          <StockRow
            key={stocks[index].symbol}
            stock={stocks[index]}
            detailRef={detailRef}
            index={index}
            count={stocks.length}
          />
        ))}
      </ul>
    </div>
  );
}

function StockList({
  detailRef,
}: {
  detailRef: RefObject<HTMLElement | null>;
}) {
  const [savedOnly, setSavedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const status = useStockChart((state) => state.listStatus);
  const load = useStockChart((state) => state.loadStocks);
  const stocks = useStockChart(
    useShallow((state) =>
      savedOnly
        ? Object.keys(state.bookmarksBySymbol)
            .filter((symbol) => state.bookmarksBySymbol[symbol]?.value)
            .map((symbol) => state.stocksBySymbol[symbol])
        : state.stocks,
    ),
  );
  const query = search.trim().toLowerCase();
  const matching = useMemo(
    () =>
      query
        ? stocks.filter(
            ({ symbol, name, sector }) =>
              symbol.toLowerCase().includes(query) ||
              name.toLowerCase().includes(query) ||
              sector.toLowerCase().includes(query),
          )
        : stocks,
    [stocks, query],
  );
  return (
    <section className="stocks-list" aria-labelledby="stocks-watchlist-title">
      <div className="stocks-list-header">
        <h2 id="stocks-watchlist-title">Watchlist</h2>
        {status === "ready" && (
          <span role="status">
            {countFormat.format(matching.length)}{" "}
            {matching.length === 1 ? "symbol" : "symbols"}
          </span>
        )}
      </div>
      <label className="stocks-search">
        <Search size={15} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search stocks"
          placeholder="Search stocks"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <div className="stocks-filters" role="group" aria-label="Filter stocks">
        <button
          type="button"
          aria-pressed={!savedOnly}
          onClick={() => setSavedOnly(false)}
        >
          All stocks
        </button>
        <button
          type="button"
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(true)}
        >
          <Bookmark size={13} aria-hidden="true" /> Bookmarked
        </button>
      </div>
      {status === "ready" ? (
        matching.length ? (
          <StockResults
            key={`${savedOnly}:${query}`}
            stocks={matching}
            detailRef={detailRef}
          />
        ) : (
          <p className="stocks-list-message">
            {query
              ? "No matching stocks."
              : savedOnly
                ? "Bookmark a stock to add it here."
                : "No stocks available."}
          </p>
        )
      ) : status === "error" ? (
        <div className="stocks-list-message">
          <p role="alert">Couldn’t load the watchlist.</p>
          <button type="button" onClick={() => void load()}>
            Try again
          </button>
        </div>
      ) : (
        <p className="stocks-list-message" role="status">
          Loading watchlist…
        </p>
      )}
    </section>
  );
}

function ChartPanel({ symbol }: { symbol: string }) {
  const status = useStockChart((state) => state.detailStatus);
  const detail = useStockChart((state) => state.detailsBySymbol[symbol]);
  const select = useStockChart((state) => state.selectStock);
  const ready = status === "ready" && detail;

  return (
    <div className="stocks-detail-body">
      {ready ? (
        <PriceHistory key={symbol} points={detail.points} />
      ) : (
        <>
          <div className="stocks-chart-toolbar">
            <h3>Price history</h3>
          </div>
          <div className="stocks-chart stocks-chart-placeholder">
            <div className="stocks-placeholder-grid" aria-hidden="true" />
            {status === "error" ? (
              <div className="stocks-chart-message">
                <p role="alert">Couldn’t load price history for {symbol}.</p>
                <button type="button" onClick={() => void select(symbol, true)}>
                  Try again
                </button>
              </div>
            ) : (
              <div className="stocks-chart-message" role="status">
                <span className="stocks-spinner" aria-hidden="true" />
                Loading price history for {symbol}…
              </div>
            )}
          </div>
        </>
      )}
      <div className="stocks-detail-footer">
        <span>
          {ready
            ? `Last request · ${(detail.requestMs / 1000).toFixed(2)} s`
            : "Simulated history request · 1–3 s"}
        </span>
        <button
          type="button"
          disabled={status === "loading"}
          onClick={() => void select(symbol, true)}
        >
          <RotateCw size={14} aria-hidden="true" /> Reload history
        </button>
      </div>
    </div>
  );
}

function StockDetail({
  detailRef,
}: {
  detailRef: RefObject<HTMLElement | null>;
}) {
  const stock = useStockChart((state) =>
    state.selectedSymbol
      ? state.stocksBySymbol[state.selectedSymbol]
      : undefined,
  );

  return (
    <section
      id="stock-chart-detail"
      ref={detailRef}
      className="stocks-detail"
      aria-label="Stock detail"
    >
      {stock ? (
        <>
          <div className="stocks-detail-heading">
            <div>
              <div className="stocks-symbol">
                <span>{stock.symbol}</span>
                <span>{stock.sector}</span>
              </div>
              <h2>{stock.name}</h2>
              <StockPrice stock={stock} detail />
            </div>
            <BookmarkButton symbol={stock.symbol} withLabel />
          </div>
          <ChartPanel symbol={stock.symbol} />
        </>
      ) : (
        <div className="stocks-detail-empty">
          Select a stock to see its price history.
        </div>
      )}
    </section>
  );
}

export default function StockChartExperiment() {
  const load = useStockChart((state) => state.loadStocks);
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="stocks-experiment">
      <div className="stocks-heading">
        <div>
          <div className="stocks-kicker">
            <Activity size={17} aria-hidden="true" /> Equities
          </div>
          <p>Market watch</p>
        </div>
        <QuoteFeedStatus />
      </div>
      <BookmarkFeedback />
      <div className="stocks-layout">
        <StockList detailRef={detailRef} />
        <StockDetail detailRef={detailRef} />
      </div>
    </div>
  );
}
