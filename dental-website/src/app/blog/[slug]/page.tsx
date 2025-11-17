import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { BlogPostSidebar } from '@/components/blog/BlogPostSidebar';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { BlogPostNavigation } from '@/components/blog/BlogPostNavigation';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  if (!post) {
    return {
      title: 'Artigo não encontrado',
    };
  }

  return {
    title: `${post.title} - Clínica Odontológica`,
    description: post.excerpt || '',
    keywords: post.tags.map(t => t.name).join(', '),
    authors: [{ name: post.author.name || 'Admin' }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || '',
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ] : [],
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name || 'Admin'],
      tags: post.tags.map(t => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const postData = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  if (!postData || postData.status !== 'published') {
    notFound();
  }

  // Increment view count
  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  // Get related posts (same category or shared tags)
  const relatedPostsData = await prisma.post.findMany({
    where: {
      status: 'published',
      publishedAt: { lte: new Date() },
      slug: { not: slug },
      OR: [
        { categoryId: postData.categoryId },
        { tags: { some: { id: { in: postData.tags.map(t => t.id) } } } },
      ],
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  // Transform to expected format
  const post = {
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt || '',
    content: postData.content,
    date: postData.publishedAt?.toISOString() || postData.createdAt.toISOString(),
    author: postData.author.name || 'Admin',
    category: postData.category?.name || 'Geral',
    tags: postData.tags.map(t => t.name),
    image: postData.featuredImage || '/images/blog/default.jpg',
    featured: postData.featured,
    readingTime: postData.readingTime || '5 min',
  };

  const relatedPosts = relatedPostsData.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    date: p.publishedAt?.toISOString() || p.createdAt.toISOString(),
    author: p.author.name || 'Admin',
    category: p.category?.name || 'Geral',
    tags: p.tags.map(t => t.name),
    image: p.featuredImage || '/images/blog/default.jpg',
    featured: p.featured,
    readingTime: p.readingTime || '5 min',
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-teal-400 rounded-full filter blur-3xl"></div>
      </div>

      <Navigation />
      <main className="relative">
        <article className="py-8 pt-36">
          <div className="container mx-auto px-4">
            <BlogPostHeader post={post} />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <BlogPostContent>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </BlogPostContent>

                {/* Post Tags */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Compartilhar:</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Facebook
                    </button>
                    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Twitter
                    </button>
                    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <BlogPostSidebar post={post} />
              </div>
            </div>

            {/* Navigation between posts */}
            <BlogPostNavigation currentSlug={slug} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-t border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  💙 Precisa de Ajuda?
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Precisa de Ajuda com Bruxismo?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Agende uma consulta gratuita e converse com nossos especialistas
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Agendar Consulta
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                  Falar no WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}