const { PrismaClient } = require('@prisma/client');

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
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('local_database_check_ok');
  } catch {
    console.error('local_database_check_failed');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
