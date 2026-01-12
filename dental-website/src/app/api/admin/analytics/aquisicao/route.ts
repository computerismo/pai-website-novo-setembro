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
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!umamiClient.isConfigured()) {
    return NextResponse.json({ 
      error: 'Umami not configured',
      message: 'Please configure Umami environment variables.'
    }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') || '7d') as PeriodKey;

  const endAt = Date.now();
  const startAt = endAt - (periodMap[period] || periodMap['7d']);

  try {
    // Fetch acquisition-related data with expanded metrics
    const [referrers, channels, channelsExpanded, queries] = await Promise.all([
      umamiClient.getMetrics(startAt, endAt, 'referrer', 20),
      umamiClient.getMetrics(startAt, endAt, 'channel', 10),
      umamiClient.getExpandedMetrics(startAt, endAt, 'channel', 10),
      umamiClient.getMetrics(startAt, endAt, 'query', 20),
    ]);

    return NextResponse.json({
      referrers,
      channels,
      channelsExpanded,
      queries,
      period,
      startAt,
      endAt,
    });
  } catch (error) {
    console.error('Failed to fetch acquisition analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
