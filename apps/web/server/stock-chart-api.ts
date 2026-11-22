import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { setTimeout as wait } from "node:timers/promises";
import type { ServerResponse } from "node:http";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";
import type {
  StockCatalogResponse,
  StockQuote,
} from "../src/components/experiments/stock-chart/types";
import { createQuoteFeed } from "./stock-quote-feed";

const fixtures = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    sector: "Semiconductors",
    price: 191.8,
    change: 2.38,
    sessions: 1000,
  },
  {
    symbol: "AAPL",
    name: "Apple",
    sector: "Consumer electronics",
    price: 259.48,
    change: -0.71,
    sessions: 740,
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    sector: "Enterprise software",
    price: 430.29,
    change: 1.24,
    sessions: 910,
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    sector: "Semiconductors",
    price: 236.72,
    change: 3.12,
    sessions: 480,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet",
    sector: "Internet services",
    price: 338.73,
    change: 0.86,
    sessions: 680,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    sector: "Social media",
    price: 716.5,
    change: -1.15,
    sessions: 560,
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    sector: "E-commerce",
    price: 239.3,
    change: 0.54,
    sessions: 820,
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    sector: "Automotive",
    price: 430.41,
    change: -2.26,
    sessions: 360,
  },
  {
    symbol: "SPOT",
    name: "Spotify",
    sector: "Audio streaming",
    price: 504.25,
    change: 1.68,
    sessions: 220,
  },
  {
    symbol: "RBLX",
    name: "Roblox",
    sector: "Gaming",
    price: 60.71,
    change: -0.92,
    sessions: 100,
  },
];

const syntheticCount = 10_000;
const syntheticSymbol = /^SIM(\d{5})$/;
const companyPrefixes = [
  "Aster",
  "Boreal",
  "Cedar",
  "Delta",
  "Ember",
  "Falcon",
  "Granite",
  "Harbor",
  "Juniper",
  "Orion",
];
const sectors = [
  "Aerospace",
  "Biotechnology",
  "Energy",
  "Financial services",
  "Healthcare",
  "Industrials",
  "Logistics",
  "Retail",
  "Software",
  "Telecommunications",
];

function syntheticFixture(id: number) {
  const sector =
    sectors[Math.floor((id - 1) / companyPrefixes.length) % sectors.length];
  return {
    symbol: `SIM${String(id).padStart(5, "0")}`,
    name: `${companyPrefixes[(id - 1) % companyPrefixes.length]} ${sector} ${id}`,
    sector,
    price: (2500 + ((id * 7919) % 57500)) / 100,
    change: (((id * 59) % 1001) - 500) / 100,
    sessions: 100 + (((id - 1) * 137) % 901),
    seed: fixtures.length + id,
  };
}

const newestSession = new Date("2026-01-30T00:00:00Z");
const sessionDates = Array.from({ length: 1000 }, () => {
  const date = newestSession.toISOString().slice(0, 10);
  do {
    newestSession.setUTCDate(newestSession.getUTCDate() - 1);
  } while (newestSession.getUTCDay() === 0 || newestSession.getUTCDay() === 6);
  return date;
});

function forEachPrice(
  {
    price,
    change,
    sessions,
    seed,
  }: { price: number; change: number; sessions: number; seed: number },
  insert: (date: string, close: number) => void,
  start = 0,
) {
  let close = price / (1 + change / 100);
  for (let offset = 0; offset < sessions; offset++) {
    if (offset >= start) {
      insert(
        sessionDates[offset],
        Number((offset === 0 ? price : close).toFixed(2)),
      );
    }
    if (offset > 0) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 2 ** 32 - 0.5;
      close *= 1 + noise * 0.045 + Math.sin(offset / 16) * 0.004 - 0.00085;
    }
  }
}

function seedStocks(db: DatabaseSync) {
  const addStock = db.prepare(
    "INSERT INTO stocks (symbol, name, sector) VALUES (?, ?, ?)",
  );
  const addPrice = db.prepare(
    "INSERT INTO stock_prices (symbol, date, close) VALUES (?, ?, ?)",
  );
  db.exec("BEGIN IMMEDIATE");
  try {
    if (!db.prepare("SELECT 1 FROM stocks LIMIT 1").get()) {
      fixtures.forEach((fixture, index) => {
        addStock.run(fixture.symbol, fixture.name, fixture.sector);
        forEachPrice({ ...fixture, seed: index + 1 }, (date, close) =>
          addPrice.run(fixture.symbol, date, close),
        );
      });
    }
    if (
      !db
        .prepare("SELECT 1 FROM stocks WHERE symbol = ?")
        .get(syntheticFixture(syntheticCount).symbol)
    ) {
      for (let id = 1; id <= syntheticCount; id++) {
        const fixture = syntheticFixture(id);
        addStock.run(fixture.symbol, fixture.name, fixture.sector);
        // The watchlist only needs the latest two closes to compute its quote.
        forEachPrice({ ...fixture, sessions: 2 }, (date, close) =>
          addPrice.run(fixture.symbol, date, close),
        );
      }
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function readHistory(db: DatabaseSync, symbol: string) {
  const select = db.prepare(
    "SELECT date, close FROM stock_prices WHERE symbol = ? ORDER BY date",
  );
  const points = select.all(symbol);
  const match = syntheticSymbol.exec(symbol);
  if (!match || points.length !== 2) return points;

  const insert = db.prepare(
    "INSERT OR IGNORE INTO stock_prices (symbol, date, close) VALUES (?, ?, ?)",
  );
  db.exec("BEGIN IMMEDIATE");
  try {
    forEachPrice(
      syntheticFixture(Number(match[1])),
      (date, close) => insert.run(symbol, date, close),
      2,
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return select.all(symbol);
}

async function openDatabase(root: string) {
  const { DatabaseSync } = await import("node:sqlite");
  const folder = path.join(root, ".cache");
  mkdirSync(folder, { recursive: true });
  const db = new DatabaseSync(path.join(folder, "stock-chart.sqlite"));
  try {
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;

      CREATE TABLE IF NOT EXISTS stocks (
        symbol TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sector TEXT NOT NULL
      ) STRICT;

      CREATE TABLE IF NOT EXISTS stock_prices (
        symbol TEXT NOT NULL REFERENCES stocks(symbol),
        date TEXT NOT NULL,
        close REAL NOT NULL CHECK (close > 0),
        PRIMARY KEY (symbol, date)
      ) STRICT;

      CREATE TABLE IF NOT EXISTS stock_bookmarks (
        symbol TEXT PRIMARY KEY REFERENCES stocks(symbol)
      ) STRICT;
    `);
    seedStocks(db);
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

function readQuoteCatalog(db: DatabaseSync) {
  const rows = db
    .prepare(
      `
    WITH quotes AS (
      SELECT s.rowid, s.symbol, s.name, s.sector,
        (SELECT p.close FROM stock_prices p WHERE p.symbol = s.symbol ORDER BY p.date DESC LIMIT 1) AS price,
        (SELECT p.close FROM stock_prices p WHERE p.symbol = s.symbol ORDER BY p.date DESC LIMIT 1 OFFSET 1) AS previousClose
      FROM stocks s
    )
    SELECT symbol, name, sector, price, previousClose,
      ROUND(100 * (price / previousClose - 1), 2) AS changePercent
    FROM quotes
    ORDER BY rowid
  `,
    )
    .all();

  const stocks = rows.map(
    (row, quoteIndex): StockQuote => ({
      symbol: String(row.symbol),
      name: String(row.name),
      sector: String(row.sector),
      price: Number(row.price),
      previousClose: Number(row.previousClose),
      changePercent: Number(row.changePercent),
      quoteIndex,
    }),
  );
  const catalogVersion = createHash("sha256")
    .update(stocks.map(({ symbol }) => symbol).join(","))
    .digest("hex")
    .slice(0, 16);
  return { stocks, catalogVersion };
}

const prefix = "/api/stock-chart/";

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function installApi(server: ViteDevServer | PreviewServer) {
  let database: Promise<DatabaseSync> | undefined;
  let catalog: ReturnType<typeof readQuoteCatalog> | undefined;
  let subscribeToQuotes: ReturnType<typeof createQuoteFeed> | undefined;
  server.httpServer?.once("close", () => {
    void database?.then(
      (db) => db.close(),
      () => {},
    );
  });

  server.middlewares.use((req, res, next) => {
    const pathname = req.url?.split("?")[0];
    if (!pathname?.startsWith(prefix)) return next();

    const abort = new AbortController();
    res.once("close", () => abort.abort());

    void (async () => {
      const route = pathname.slice(prefix.length);
      const match = /^(stocks|bookmarks)\/([A-Z0-9]{1,8})$/.exec(route);
      if (route !== "stocks" && route !== "quotes" && !match) {
        return sendJson(res, 404, { error: "Endpoint not found." });
      }

      const bookmark = match?.[1] === "bookmarks";
      const allowed = bookmark ? ["PUT", "DELETE"] : ["GET"];
      if (!allowed.includes(req.method ?? "")) {
        res.setHeader("Allow", allowed.join(", "));
        return sendJson(res, 405, { error: "Method not allowed." });
      }

      database ??= openDatabase(server.config.root).catch((error: unknown) => {
        database = undefined;
        throw error;
      });
      const db = await database;
      if (abort.signal.aborted) return;

      if (!match) {
        catalog ??= readQuoteCatalog(db);
        if (route === "quotes") {
          subscribeToQuotes ??= createQuoteFeed(
            catalog.catalogVersion,
            catalog.stocks,
          );
          return subscribeToQuotes(res);
        }

        const bookmarkedSymbols = new Set(
          db
            .prepare("SELECT symbol FROM stock_bookmarks")
            .all()
            .map(({ symbol }) => symbol),
        );
        const response: StockCatalogResponse = {
          catalogVersion: catalog.catalogVersion,
          stocks: catalog.stocks.map((stock) => ({
            ...stock,
            bookmarked: bookmarkedSymbols.has(stock.symbol),
          })),
        };
        return sendJson(res, 200, response);
      }

      const symbol = match[2];
      if (!db.prepare("SELECT 1 FROM stocks WHERE symbol = ?").get(symbol)) {
        return sendJson(res, 404, { error: "Stock not found." });
      }

      if (bookmark) {
        const bookmarked = req.method === "PUT";
        if (bookmarked) {
          db.prepare(
            "INSERT OR IGNORE INTO stock_bookmarks (symbol) VALUES (?)",
          ).run(symbol);
        } else {
          db.prepare("DELETE FROM stock_bookmarks WHERE symbol = ?").run(
            symbol,
          );
        }
        await wait(650, undefined, { signal: abort.signal });
        return sendJson(res, 200, { symbol, bookmarked });
      }

      await wait(1000 + Math.floor(Math.random() * 2001), undefined, {
        signal: abort.signal,
      });
      const points = readHistory(db, symbol);
      return sendJson(res, 200, { symbol, points });
    })().catch((error: unknown) => {
      if (abort.signal.aborted) return;
      console.error("[stock-chart]", error);
      if (res.headersSent) res.destroy();
      else sendJson(res, 500, { error: "The stock database is unavailable." });
    });
  });
}

export function stockChartApi(): Plugin {
  return {
    name: "stock-chart-api",
    configureServer: installApi,
    configurePreviewServer: installApi,
  };
}
