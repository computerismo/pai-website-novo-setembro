import { prisma } from '@/lib/db';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogHero } from '@/components/blog/BlogHero';
import { Mail } from 'lucide-react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Clínica Odontológica',
  description: 'Artigos sobre saúde bucal, tratamento de bruxismo, dicas de cuidados dentários e novidades da odontologia.',
  keywords: ['blog odontológico', 'saúde bucal', 'bruxismo', 'dicas dentárias'],
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const allPostsData = await prisma.post.findMany({
    where: {
      status: 'published',
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      author: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  const featuredPostsData = await prisma.post.findMany({
    where: {
      status: 'published',
      publishedAt: { lte: new Date() },
      featured: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: {
      author: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  // Transform data to match the expected format
  const allPosts = allPostsData.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    content: '', // Not needed for card display
    date: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    author: post.author?.name || 'Admin',
    tags: post.tags?.map((t) => t.name) || [],
    image: post.featuredImage || '/images/blog/default.jpg',
    featured: post.featured,
    readingTime: post.readingTime || '5 min',
  }));

  const featuredPosts = featuredPostsData.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    content: '', // Not needed for card display
    date: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    author: post.author?.name || 'Admin',
    tags: post.tags?.map((t) => t.name) || [],
    image: post.featuredImage || '/images/blog/default.jpg',
    featured: post.featured,
    readingTime: post.readingTime || '5 min',
  }));

  return (
    <>
      <Navigation />
      <main>
        <BlogHero />

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Em Destaque</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                  Artigos em Destaque
                </h2>
                <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                  Nossos conteúdos mais importantes sobre saúde bucal e tratamento de bruxismo
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Biblioteca</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                Todos os Artigos
              </h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Explore nossa coleção completa de artigos sobre saúde bucal e odontologia
              </p>
            </div>

            {allPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-12 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-4">
                    Artigos em Breve
                  </h3>
                  <p className="text-text-light dark:text-text-dark">
                    Estamos preparando conteúdo exclusivo sobre saúde bucal e bruxismo.
                    Volte em breve para conferir nossas publicações!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#2563EB] opacity-90 dark:opacity-80 z-0"></div>
          <div 
            className="absolute inset-0 opacity-10 z-0" 
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
          ></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Receba Nossas Dicas de Saúde Bucal
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Inscreva-se para receber artigos exclusivos, dicas importantes sobre cuidados dentários
              e novidades sobre tratamento de bruxismo
            </p>

            <div className="max-w-lg mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="flex-1 px-6 py-4 rounded-xl text-heading-light bg-white border border-gray-200 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all placeholder-gray-400"
                  />
                  <button className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-500/25 whitespace-nowrap flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Inscrever-se
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-text-light">
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Conteúdo de qualidade
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Dados seguros
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}