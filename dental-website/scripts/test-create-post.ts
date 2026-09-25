import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireDisposableLocalDatabase() {
  if (process.env.RUN_DISPOSABLE_DB_TESTS !== 'true') {
    throw new Error('Set RUN_DISPOSABLE_DB_TESTS=true to run this write-and-cleanup check.');
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required.');
  const databaseUrl = new URL(connectionString);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname)) {
    throw new Error('This database test is restricted to a disposable local database.');
  }
}

async function main() {
  try {
    requireDisposableLocalDatabase();
    const author = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { id: true },
    });
    if (!author) throw new Error('No administrator is available for this local check.');

    const post = await prisma.post.create({
      data: {
        title: 'Disposable local test post',
        slug: `disposable-local-test-${Date.now()}`,
        content: '<p>Disposable local fixture.</p>',
        status: 'draft',
        authorId: author.id,
      },
      select: { id: true },
    });
    await prisma.post.delete({ where: { id: post.id } });
    console.log('disposable_post_check_ok');
  } catch {
    console.error('disposable_post_check_failed');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
