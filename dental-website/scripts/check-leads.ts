
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.lead.count();
    console.log(`Total leads: ${count}`);

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (leads.length === 0) {
      console.log('No leads found.');
    } else {
      console.log('Latest 5 leads:');
      leads.forEach((lead) => {
        console.log(`- [${lead.createdAt.toISOString()}] ${lead.name} (${lead.email}): ${lead.treatment}`);
      });
    }
  } catch (e) {
    console.error('Error querying leads:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
