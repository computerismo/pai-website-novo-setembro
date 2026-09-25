'use server';

import { prisma } from '@/lib/db';
import { authorizeServerAction } from '@/lib/security/authorization';
import { z } from 'zod';

export async function getNewLeadsCount(sinceTimestamp?: string) {
  const actor = await authorizeServerAction('leads');
  if (!actor) {
    return { success: false, count: 0, recentLeads: [] };
  }

  const parsedTimestamp = sinceTimestamp === undefined
    ? undefined
    : z.string().datetime().safeParse(sinceTimestamp);
  if (parsedTimestamp && !parsedTimestamp.success) {
    return { success: false, count: 0, recentLeads: [] };
  }

  try {
    const where = parsedTimestamp?.success
      ? { createdAt: { gt: new Date(parsedTimestamp.data) } }
      : {};

    const count = await prisma.lead.count({ where });
    
    // Also get the 5 most recent leads for preview
    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        treatment: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      count,
      recentLeads,
    };
  } catch {
    console.error('lead_count_fetch_failed');
    return {
      success: false,
      count: 0,
      recentLeads: [],
    };
  }
}
