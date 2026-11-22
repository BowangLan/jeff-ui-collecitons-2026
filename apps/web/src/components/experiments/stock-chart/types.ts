export type StockQuote = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  previousClose: number;
  changePercent: number;
  quoteIndex: number;
};

export type StockSummary = StockQuote & { bookmarked: boolean };

export type StockCatalogResponse = {
  catalogVersion: string;
  stocks: StockSummary[];
};

export type QuoteFrame = {
  catalogVersion: string;
  pricesInCents: number[];
};

export type PricePoint = {
  date: string;
  close: number;
};

export type StockHistory = {
  symbol: string;
  points: PricePoint[];
};
