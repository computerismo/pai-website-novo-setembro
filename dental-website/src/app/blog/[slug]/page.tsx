import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import NextImage from "next/image";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/BlogPostContent";

import { RelatedPosts } from "@/components/blog/RelatedPosts";

import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      select: { slug: true },
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    // Return empty array if database is unreachable during build
    // Pages will be generated on-demand instead
    console.log(
      "generateStaticParams: Database unreachable, skipping static generation",
    );
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
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
      title: "Artigo não encontrado",
    };
  }

  return {
    title: `${post.title} - Clínica Odontológica`,
    description: post.excerpt || "",
    keywords: post.tags.map((t) => t.name).join(", "),
    authors: [{ name: post.author.name || "Admin" }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || "",
      images: post.featuredImage ? [post.featuredImage] : [],
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name || "Admin"],
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
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
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!postData || postData.status !== "published") {
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
      status: "published",
      publishedAt: { lte: new Date() },
      slug: { not: slug },
      OR: [{ tags: { some: { id: { in: postData.tags.map((t) => t.id) } } } }],
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  // Transform to expected format
  const post = {
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt || "",
    content: postData.content,
    date:
      postData.publishedAt?.toISOString() || postData.createdAt.toISOString(),
    author: postData.author.name || "Admin",

    tags: postData.tags.map((t) => t.name),
    image: postData.featuredImage || "/images/blog/default.jpg",
    featured: postData.featured,
    readingTime: postData.readingTime || "5 min",
  };

  const relatedPosts = relatedPostsData.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    content: "", // Not needed for card display
    date: p.publishedAt?.toISOString() || p.createdAt.toISOString(),
    author: p.author.name || "Admin",

    tags: p.tags.map((t) => t.name),
    image: p.featuredImage || "/images/blog/default.jpg",
    featured: p.featured,
    readingTime: p.readingTime || "5 min",
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative font-sans">
      <Navigation />
      <main className="relative pt-32 lg:pt-40 pb-20">
        <article>
          {/* Header Section - Full Width */}
          <div className="container mx-auto px-4 mb-4">
            <BlogPostHeader post={post} image={post.image} />
          </div>

          {/* Main Content - Centered Reading Column */}
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <BlogPostContent>
                <div
                  className="prose prose-lg prose-slate max-w-none 
                  prose-headings:text-heading-light prose-headings:font-bold 
                  prose-p:text-text-light prose-p:leading-loose
                  prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-heading-light"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </BlogPostContent>

              {/* Post Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Tags Relacionadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 text-text-light text-sm font-medium hover:border-[#2563EB]/50 hover:text-[#2563EB] transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Compartilhar este artigo
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Facebook', 'Twitter', 'WhatsApp'].map((network) => (
                    <button 
                      key={network}
                      className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-heading-light font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:translate-y-0.5"
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4">

               <RelatedPosts posts={relatedPosts} />
            </div>
          </div>
        )}

        {/* CTA Section - Homepage Style */}
        <section className="mt-24 py-20 relative overflow-hidden">
           {/* Background similar to homepage CTA */}
           <div className="absolute inset-0 bg-[#2563EB] z-0"></div>
           <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 z-0"></div>
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
               Precisa de Ajuda com Bruxismo?
             </h2>
             <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
               Agende uma consulta gratuita e converse com nossos especialistas para encontrar o melhor tratamento para você.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-white text-[#2563EB] px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-50 transition-transform hover:-translate-y-1">
                 Agendar Consulta
               </button>
               <button className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-transform hover:-translate-y-1">
                 Falar no WhatsApp
               </button>
             </div>
           </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
