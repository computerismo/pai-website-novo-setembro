import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { umamiClient } from "@/lib/umami";

export const dynamic = "force-dynamic";

type PeriodKey = "24h" | "7d" | "30d" | "90d";

const periodMap: Record<PeriodKey, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!umamiClient.isConfigured()) {
    return NextResponse.json(
      {
        error: "Umami not configured",
        message: "Please configure Umami environment variables.",
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") || "7d") as PeriodKey;

  const endAt = Date.now();
  const startAt = endAt - (periodMap[period] || periodMap["7d"]);

  try {
    // Fetch audience-related data with expanded metrics
    const [devices, devicesExpanded, browsers, os, countries, regions, cities, languages, screens] =
      await Promise.all([
        umamiClient.getMetrics(startAt, endAt, "device", 10),
        umamiClient.getExpandedMetrics(startAt, endAt, "device", 5),
        umamiClient.getMetrics(startAt, endAt, "browser", 10),
        umamiClient.getMetrics(startAt, endAt, "os", 10),
        umamiClient.getMetrics(startAt, endAt, "country", 20),
        umamiClient.getExpandedMetrics(startAt, endAt, "region", 15),
        umamiClient.getMetrics(startAt, endAt, "city", 20),
        umamiClient.getMetrics(startAt, endAt, "language", 10),
        umamiClient.getMetrics(startAt, endAt, "screen", 10),
      ]);

    return NextResponse.json({
      devices,
      devicesExpanded,
      browsers,
      os,
      countries,
      regions,
      cities,
      languages,
      screens,
      period,
      startAt,
      endAt,
    });
  } catch (error) {
    console.error("Failed to fetch audience analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
