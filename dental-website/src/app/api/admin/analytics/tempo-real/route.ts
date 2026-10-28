import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { umamiClient } from '@/lib/umami';

export const dynamic = 'force-dynamic';

export async function GET() {
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
  } catch (error) {
    console.error('Failed to fetch realtime analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
