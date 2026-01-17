
export interface SeoStatsResponse {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  history: SeoHistoryPoint[];
  period: string;
  status: string;
}

export interface SeoHistoryPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SeoQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SeoPage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SitemapStatus {
  path: string;
  lastSubmitted: string | null;
  isPending: boolean | null;
  isSitemapsIndex: boolean | null;
  lastCrawled: string | null;
  errors: number | null;
  warnings: number | null;
}
