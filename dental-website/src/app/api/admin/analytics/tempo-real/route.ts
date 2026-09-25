import { NextResponse } from 'next/server';
import { authorizeApi } from '@/lib/security/authorization';
import { umamiClient } from '@/lib/umami';

export const dynamic = 'force-dynamic';

export async function GET() {
  const access = await authorizeApi('analytics');
  if (!access.ok) return access.response;

  if (!umamiClient.isConfigured()) {
    return NextResponse.json({ 
      error: 'Umami not configured',
      message: 'Please configure Umami environment variables.'
    }, { status: 503 });
  }

  try {
    // Fetch realtime data
    const [realtime, activeVisitors] = await Promise.all([
      umamiClient.getRealtime(),
      umamiClient.getActiveVisitors(),
    ]);

    return NextResponse.json({
      ...realtime,
      activeVisitors: activeVisitors.visitors,
      timestamp: Date.now(),
    });
  } catch {
    console.error('umami_realtime_fetch_failed');
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 502 });
  }
}
