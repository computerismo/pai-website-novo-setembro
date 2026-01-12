import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { umamiClient } from '@/lib/umami';

export const dynamic = 'force-dynamic';

type PeriodKey = '24h' | '7d' | '30d' | '90d';

const periodMap: Record<PeriodKey, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  '90d': 90 * 24 * 60 * 60 * 1000,
};

export async function GET(request: Request) {
  // Verify admin authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if Umami is configured
  if (!umamiClient.isConfigured()) {
    return NextResponse.json({ 
      error: 'Umami not configured',
      message: 'Please configure UMAMI_URL, UMAMI_USERNAME, UMAMI_PASSWORD, and UMAMI_WEBSITE_ID environment variables.'
    }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') || '7d') as PeriodKey;

  // Calculate date range
  const endAt = Date.now();
  const startAt = endAt - (periodMap[period] || periodMap['7d']);

  try {
    // Fetch behavior-related data including expanded metrics
    const [topPages, topPagesExpanded, entryPages, exitPages, events, eventsSeries, pageviews, sessionsWeekly] = await Promise.all([
      umamiClient.getMetrics(startAt, endAt, 'path', 20),
      umamiClient.getExpandedMetrics(startAt, endAt, 'path', 10),
      umamiClient.getMetrics(startAt, endAt, 'entry', 15),
      umamiClient.getMetrics(startAt, endAt, 'exit', 15),
      umamiClient.getMetrics(startAt, endAt, 'event', 20),
      umamiClient.getEventsSeries(startAt, endAt, period === '24h' ? 'hour' : 'day'),
      umamiClient.getPageviews(startAt, endAt, period === '24h' ? 'hour' : 'day'),
      umamiClient.getSessionsWeekly(startAt, endAt),
    ]);

    return NextResponse.json({
      topPages,
      topPagesExpanded,
      entryPages,
      exitPages,
      events,
      eventsSeries,
      pageviews,
      sessionsWeekly,
      period,
      startAt,
      endAt,
    });
  } catch (error) {
    console.error('Failed to fetch behavior analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
