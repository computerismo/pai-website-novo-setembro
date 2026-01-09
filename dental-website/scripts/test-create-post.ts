
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('1. Connecting to DB...');
    // Fetch the admin user to be the author
    const author = await prisma.user.findFirst({
      where: { email: 'admin@dental.com' }
    });

    if (!author) {
      console.error('❌ No admin user found! Cannot create post without author.');
      return;
    }
    console.log(`✅ Found author: ${author.name} (${author.id})`);

    console.log('2. Creating test post...');
    const post = await prisma.post.create({
      data: {
        title: 'Test Post from Script',
        slug: 'test-post-script-' + Date.now(),
        content: '<p>This is a test post content.</p>',
        status: 'draft',
        authorId: author.id,
        // Intentionally leaving categoryId null to test that fix
        categoryId: null,
      },
    });

    console.log(`✅ Post created successfully! ID: ${post.id}`);
    console.log('Title:', post.title);
    
    // Clean up
    await prisma.post.delete({ where: { id: post.id } });
    console.log('3. Cleaned up (deleted test post).');

  } catch (e) {
    console.error('❌ Error creating post:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
