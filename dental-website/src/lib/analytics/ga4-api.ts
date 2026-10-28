/**
 * GA4 Analytics API Client
 * Fetches data from the FastAPI backend
 */

// Backend URL - defaults to localhost for development
const GA_BACKEND_URL =
  process.env.NEXT_PUBLIC_GA_BACKEND_URL || "http://127.0.0.1:8000";

/**
 * Helper to convert period string to days number
 */
function periodToDays(period: string): number {
  const map: Record<string, number> = {
    "24h": 1,
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  return map[period] || 7;
}

/**
 * Generic fetch wrapper for the GA4 backend
 */
async function fetchGA4<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const url = new URL(endpoint, GA_BACKEND_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

// ============ Types ============

export interface StatsResponse {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  sessions: number;
  period: string;
}

export interface TimeSeriesPoint {
  x: string;
  y: number;
}

export interface PageviewsSeriesResponse {
  pageviews: TimeSeriesPoint[];
  sessions: TimeSeriesPoint[];
  period: string;
}

export interface MetricItem {
  x: string;
  y: number;
}

export interface TopPageItem {
  x: string;
  y: number;
  visitors: number;
  bounceRate: number;
  avgTime: number;
}

export interface TopPagesResponse {
  pages: TopPageItem[];
  period: string;
}

export interface DevicesResponse {
  devices: MetricItem[];
  period: string;
}

export interface ChannelsResponse {
  channels: Array<{ x: string; y: number; users: number }>;
  period: string;
}

export interface ReferrersResponse {
  referrers: MetricItem[];
  period: string;
}

export interface CountriesResponse {
  countries: MetricItem[];
  period: string;
}

export interface BrowsersResponse {
  browsers: MetricItem[];
  period: string;
}

export interface RealtimeCityItem {
  city: string;
  country: string;
  users: number;
}

export interface RealtimeMinuteItem {
  minutesAgo: number;
  users: number;
}

export interface RealtimeResponse {
  activeVisitors: number;
  urls: Record<string, number>;
  countries: Record<string, number>;
  cities: RealtimeCityItem[];
  devices: Record<string, number>;
  events: Record<string, number>;
  minutesTrend: RealtimeMinuteItem[];
  timestamp: string;
}

export interface EventsResponse {
  events: MetricItem[];
  period: string;
}

export interface LandingPagesResponse {
  landingPages: Array<{ x: string; y: number; bounceRate: number }>;
  period: string;
}

export interface GeocodedCity {
  city: string;
  country: string;
  lat: number;
  lng: number;
  users: number;
}

export interface GeocodeCitiesResponse {
  cities: GeocodedCity[];
}

// ============ API Functions ============

export async function getStats(period: string): Promise<StatsResponse> {
  return fetchGA4<StatsResponse>("/api/stats", { days: periodToDays(period) });
}

export async function getPageviewsSeries(
  period: string
): Promise<PageviewsSeriesResponse> {
  return fetchGA4<PageviewsSeriesResponse>("/api/pageviews-series", {
    days: periodToDays(period),
  });
}

export async function getTopPages(
  period: string,
  limit = 10
): Promise<TopPagesResponse> {
  return fetchGA4<TopPagesResponse>("/api/top-pages", {
    days: periodToDays(period),
    limit,
  });
}

export async function getDevices(period: string): Promise<DevicesResponse> {
  return fetchGA4<DevicesResponse>("/api/devices", {
    days: periodToDays(period),
  });
}

export async function getChannels(period: string): Promise<ChannelsResponse> {
  return fetchGA4<ChannelsResponse>("/api/channels", {
    days: periodToDays(period),
  });
}

export async function getReferrers(
  period: string,
  limit = 15
): Promise<ReferrersResponse> {
  return fetchGA4<ReferrersResponse>("/api/referrers", {
    days: periodToDays(period),
    limit,
  });
}

export async function getCountries(
  period: string,
  limit = 20
): Promise<CountriesResponse> {
  return fetchGA4<CountriesResponse>("/api/countries", {
    days: periodToDays(period),
    limit,
  });
}

export interface CityItem {
  city: string;
  country: string;
  visitors: number;
}

export interface CitiesResponse {
  cities: CityItem[];
  period: string;
}

export async function getCities(
  period: string,
  limit = 20
): Promise<CitiesResponse> {
  return fetchGA4<CitiesResponse>("/api/cities", {
    days: periodToDays(period),
    limit,
  });
}

export async function getBrowsers(period: string): Promise<BrowsersResponse> {
  return fetchGA4<BrowsersResponse>("/api/browsers", {
    days: periodToDays(period),
  });
}

export async function getRealtime(): Promise<RealtimeResponse> {
  return fetchGA4<RealtimeResponse>("/api/realtime");
}

export async function getEvents(period: string): Promise<EventsResponse> {
  return fetchGA4<EventsResponse>("/api/events", {
    days: periodToDays(period),
  });
}

export async function getLandingPages(
  period: string,
  limit = 10
): Promise<LandingPagesResponse> {
  return fetchGA4<LandingPagesResponse>("/api/landing-pages", {
    days: periodToDays(period),
    limit,
  });
}

export async function getLeads(
  period: string
): Promise<{ leads: number; period: string }> {
  return fetchGA4("/api/leads", { days: periodToDays(period) });
}

/**
 * Fetch all main analytics data in parallel
 */
export async function getAllAnalyticsData(period: string) {
  const [stats, pageviewsSeries, topPages, devices, channels, realtime] =
    await Promise.all([
      getStats(period),
      getPageviewsSeries(period),
      getTopPages(period),
      getDevices(period),
      getChannels(period),
      getRealtime().catch(() => ({
        activeVisitors: 0,
        urls: {},
        countries: {},
        cities: [],
        devices: {},
        events: {},
        minutesTrend: [],
        timestamp: "",
      })),
    ]);

  return {
    stats,
    pageviews: pageviewsSeries,
    topPages: topPages.pages,
    devices: devices.devices,
    channels: channels.channels,
    activeVisitors: realtime.activeVisitors,
    period,
  };
}

/**
 * Geocode cities for map display
 */
export async function geocodeCities(
  cities: Array<{ city: string; country: string; users: number }>
): Promise<GeocodeCitiesResponse> {
  const response = await fetch(`${GA_BACKEND_URL}/api/geocode-cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cities }),
  });
  
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`);
  }
  
  return response.json();
}
