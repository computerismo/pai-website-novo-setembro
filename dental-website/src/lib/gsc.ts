import "server-only";
import { SeoStatsResponse, SeoQuery, SeoPage, SitemapStatus } from "./types/seo";
import { requirePageAccess } from "@/lib/security/authorization";

const BACKEND_URL = process.env.ANALYTICS_BACKEND_URL?.replace(/\/+$/, "");

async function fetchGsc(endpoint: string, params: Record<string, number> = {}) {
  await requirePageAccess("analytics");
  const token = process.env.ANALYTICS_API_TOKEN;
  if (!BACKEND_URL || !token || token.length < 32) return null;

  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
  const suffix = query.size ? `?${query.toString()}` : "";

  try {
    const response = await fetch(`${BACKEND_URL}/api/seo/${endpoint}${suffix}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("gsc_backend_request_failed");
      return null;
    }
    return await response.json();
  } catch {
    console.error("gsc_backend_unreachable");
    return null;
  }
}

function boundedDays(days: number, fallback = 28): number {
  return Number.isFinite(days) ? Math.min(90, Math.max(1, Math.trunc(days))) : fallback;
}

function boundedLimit(limit: number): number {
  return Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.trunc(limit))) : 20;
}

export async function getSeoOverview(days = 28): Promise<SeoStatsResponse | null> {
  return fetchGsc("overview", { days: boundedDays(days) });
}

export async function getSeoQueries(
  days = 28,
  limit = 20
): Promise<{ queries: SeoQuery[]; period: string } | null> {
  return fetchGsc("queries", { days: boundedDays(days), limit: boundedLimit(limit) });
}

export async function getSeoPages(
  days = 28,
  limit = 20
): Promise<{ pages: SeoPage[]; period: string } | null> {
  return fetchGsc("pages", { days: boundedDays(days), limit: boundedLimit(limit) });
}

export async function getSitemaps(): Promise<{ sitemaps: SitemapStatus[] } | null> {
  return fetchGsc("sitemaps");
}
