import { NextRequest, NextResponse } from "next/server";
import { authorizeApi } from "@/lib/security/authorization";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";

const GET_ENDPOINTS = new Set([
  "api/stats",
  "api/leads",
  "api/pageviews-series",
  "api/top-pages",
  "api/devices",
  "api/channels",
  "api/referrers",
  "api/countries",
  "api/cities",
  "api/browsers",
  "api/operating-systems",
  "api/realtime",
  "api/events",
  "api/landing-pages",
  "api/exit-pages",
]);
const POST_ENDPOINTS = new Set(["api/geocode-cities"]);

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function proxy(request: NextRequest, { params }: RouteParams, method: "GET" | "POST") {
  const access = await authorizeApi("analytics");
  if (!access.ok) return access.response;

  const endpoint = (await params).path.join("/");
  if (!(method === "GET" ? GET_ENDPOINTS : POST_ENDPOINTS).has(endpoint)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const backendUrl = process.env.ANALYTICS_BACKEND_URL?.replace(/\/+$/, "");
  const token = process.env.ANALYTICS_API_TOKEN;
  if (!backendUrl || !token || token.length < 32) {
    return NextResponse.json({ error: "Analytics service is not configured" }, { status: 503 });
  }

  let body: string | undefined;
  if (method === "POST") {
    const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (contentType !== "application/json") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    try {
      body = JSON.stringify(await readJsonBody<unknown>(request, 64 * 1024));
    } catch (error) {
      if (error instanceof RequestBodyError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  }

  const query = method === "GET" ? request.nextUrl.searchParams.toString() : "";
  try {
    const upstream = await fetch(`${backendUrl}/${endpoint}${query ? `?${query}` : ""}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      console.error("analytics_backend_request_failed");
      return NextResponse.json({ error: "Analytics service is unavailable" }, { status: 502 });
    }

    const data = await upstream.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    console.error("analytics_backend_unreachable");
    return NextResponse.json({ error: "Analytics service is unavailable" }, { status: 502 });
  }
}

export function GET(request: NextRequest, context: RouteParams) {
  return proxy(request, context, "GET");
}

export function POST(request: NextRequest, context: RouteParams) {
  return proxy(request, context, "POST");
}
