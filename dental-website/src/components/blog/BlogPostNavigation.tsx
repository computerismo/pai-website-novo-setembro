import { getAllPostSlugs, getPostBySlug } from '@/lib/blog/posts';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPostNavigationProps {
  currentSlug: string;
}

export function BlogPostNavigation({ currentSlug }: BlogPostNavigationProps) {
  const allSlugs = getAllPostSlugs();
  const currentIndex = allSlugs.findIndex(slug => slug === currentSlug);
  
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;
  
  const prevPost = prevSlug ? getPostBySlug(prevSlug) : null;
  const nextPost = nextSlug ? getPostBySlug(nextSlug) : null;

  if (!prevPost && !nextPost) return null;

  return (
    <nav className="mt-12 pt-12 border-t border-gray-200">
      <div className="flex justify-between items-center">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div>
              <div className="text-sm text-gray-500">Artigo anterior</div>
              <div className="font-medium">{prevPost.title}</div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors group text-right"
          >
            <div>
              <div className="text-sm text-gray-500">Próximo artigo</div>
              <div className="font-medium">{nextPost.title}</div>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
}