'use server';

import { prisma } from '@/lib/db';

export async function getNewLeadsCount(sinceTimestamp?: string) {
  try {
    const where: any = {};
    
    if (sinceTimestamp) {
      where.createdAt = {
        gt: new Date(sinceTimestamp),
      };
    }

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
  } catch (error) {
    console.error('Error getting new leads count:', error);
    return {
      success: false,
      count: 0,
      recentLeads: [],
    };
  }
}
