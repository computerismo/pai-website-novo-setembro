
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Raw query to list all databases in this Postgres instance
    const dbs = await prisma.$queryRawUnsafe(`
      SELECT datname FROM pg_database
      WHERE datistemplate = false;
    `);
    
    console.log('--- CONNECTED POSTGRESQL INSTANCE DATABASES ---');
    console.log('Host: localhost:5433 (DOCKER)');
    console.log('User: postgres');
    console.log('Password used: admin123');
    console.log('---------------------------------------------');
    console.log(dbs);
    console.log('---------------------------------------------');
    
  } catch (e) {
    console.error('Error listing databases:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
