import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireLocalDatabase() {
  if (process.env.RUN_LOCAL_DB_DIAGNOSTIC !== 'true') {
    throw new Error('Set RUN_LOCAL_DB_DIAGNOSTIC=true to run this local-only check.');
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required.');
  const databaseUrl = new URL(connectionString);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname)) {
    throw new Error('This diagnostic is restricted to a local database.');
  }
}

async function main() {
  try {
    requireLocalDatabase();
    const counts = await prisma.lead.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    console.log(JSON.stringify(counts.map(({ status, _count }) => ({ status, count: _count.id }))));
  } catch {
    console.error('local_lead_summary_failed');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
