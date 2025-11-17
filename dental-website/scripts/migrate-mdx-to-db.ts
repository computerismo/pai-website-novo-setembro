/**
 * Migration script to transfer MDX blog posts to database
 *
 * This script will:
 * 1. Read all MDX files from content/blog/
 * 2. Parse frontmatter and content
 * 3. Create categories and tags if they don't exist
 * 4. Create database entries for each post
 *
 * Usage:
 * 1. Make sure you have a DATABASE_URL in your .env file
 * 2. Run: npx ts-node scripts/migrate-mdx-to-db.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

interface MDXPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  readingTime: string;
  content: string;
}

async function main() {
  console.log('🚀 Starting MDX to Database migration...\n');

  // Create default admin user if doesn't exist
  let adminUser = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (!adminUser) {
    console.log('Creating default admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    adminUser = await prisma.user.create({
      data: {
        email: 'admin@clinica.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      },
    });
    console.log('✅ Admin user created: admin@clinica.com / admin123\n');
  }

  // Read all MDX files
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

  console.log(`Found ${files.length} MDX files to migrate\n`);

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    const post = frontmatter as MDXPost;
    post.content = content;

    console.log(`📝 Migrating: ${post.title}`);

    try {
      // Create or get category
      let category = await prisma.category.findUnique({
        where: { slug: slugify(post.category) },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: post.category,
            slug: slugify(post.category),
          },
        });
        console.log(`  ✅ Created category: ${post.category}`);
      }

      // Create or get tags
      const tagRecords = [];
      for (const tagName of post.tags) {
        let tag = await prisma.tag.findUnique({
          where: { slug: slugify(tagName) },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: slugify(tagName),
            },
          });
          console.log(`  ✅ Created tag: ${tagName}`);
        }

        tagRecords.push({ id: tag.id });
      }

      // Check if post already exists
      const existingPost = await prisma.post.findUnique({
        where: { slug: post.slug },
      });

      if (existingPost) {
        console.log(`  ⚠️  Post already exists, skipping: ${post.slug}\n`);
        continue;
      }

      // Create post
      await prisma.post.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.image,
          status: 'published',
          publishedAt: new Date(post.date),
          featured: post.featured,
          readingTime: post.readingTime,
          authorId: adminUser.id,
          categoryId: category.id,
          tags: {
            connect: tagRecords,
          },
        },
      });

      console.log(`  ✅ Post migrated successfully\n`);
    } catch (error) {
      console.error(`  ❌ Error migrating post: ${error}\n`);
    }
  }

  console.log('✨ Migration completed!');
  console.log('\n📊 Summary:');
  const stats = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
  ]);
  console.log(`  Posts: ${stats[0]}`);
  console.log(`  Categories: ${stats[1]}`);
  console.log(`  Tags: ${stats[2]}`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
