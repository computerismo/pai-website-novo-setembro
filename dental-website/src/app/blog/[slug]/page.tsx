import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog/posts';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { BlogPostSidebar } from '@/components/blog/BlogPostSidebar';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { BlogPostNavigation } from '@/components/blog/BlogPostNavigation';
import components from '@/components/blog/MDXComponents';
import { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artigo não encontrado',
    };
  }

  return {
    title: `${post.title} - Clínica Odontológica`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <>
      <Navigation />
      <main>
        <article className="py-8">
          <div className="container mx-auto px-4">
            <BlogPostHeader post={post} />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <BlogPostContent>
                  <MDXRemote
                    source={post.content}
                    components={components}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [
                          rehypeSlug,
                          [
                            rehypeAutolinkHeadings,
                            {
                              behavior: 'wrap',
                              properties: {
                                className: ['anchor'],
                              },
                            },
                          ],
                        ],
                      },
                    }}
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
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Precisa de Ajuda com Bruxismo?
            </h2>
            <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
              Agende uma consulta gratuita e converse com nossos especialistas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Agendar Consulta
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}