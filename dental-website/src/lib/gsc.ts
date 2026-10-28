
import { SeoStatsResponse, SeoQuery, SeoPage, SitemapStatus } from "./types/seo";

const BACKEND_URL = process.env.NEXT_PUBLIC_GA_BACKEND_URL || 'http://localhost:8000';

async function fetchGsc(endpoint: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/seo/${endpoint}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
       console.error(`GSC API Error: ${res.status} ${res.statusText}`);
       // Return null or empty data on error to prevent page crash
       return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error("GSC Fetch Error:", error);
    return null;
  }
}

export async function getSeoOverview(days: number = 28): Promise<SeoStatsResponse | null> {
  return fetchGsc(`overview?days=${days}`);
}

export async function getSeoQueries(days: number = 28, limit: number = 20): Promise<{queries: SeoQuery[], period: string} | null> {
  return fetchGsc(`queries?days=${days}&limit=${limit}`);
}

export async function getSeoPages(days: number = 28, limit: number = 20): Promise<{pages: SeoPage[], period: string} | null> {
  return fetchGsc(`pages?days=${days}&limit=${limit}`);
}

export async function getSitemaps(): Promise<{sitemaps: SitemapStatus[]} | null> {
  return fetchGsc(`sitemaps`);
}
