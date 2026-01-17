import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog/posts';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const showImage = post.image && post.image !== '/images/blog/default.jpg';

  return (
    <article className="group h-full">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className={`bg-white dark:bg-surface-dark rounded-2xl border h-full flex flex-col transition-all duration-300 overflow-hidden ${
          featured 
            ? 'border-[#2563EB]/30 ring-1 ring-[#2563EB]/10 shadow-sm hover:shadow-lg hover:border-[#2563EB]/50' 
            : 'border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md'
        } group-hover:-translate-y-1`}>
          {/* Conditional Image */}
          {showImage && (
            <div className="relative w-full h-48 sm:h-56">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            {/* Title */}
            <h2 className={`font-bold text-heading-light dark:text-heading-dark mb-3 group-hover:text-[#2563EB] transition-colors leading-tight ${
              featured ? 'text-2xl' : 'text-xl'
            }`}>
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm text-text-light dark:text-text-dark mb-6 leading-relaxed line-clamp-2 md:line-clamp-3 flex-grow">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-text-light dark:text-text-dark mb-4 flex-wrap opacity-70">
              <time dateTime={post.date}>
                {format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </time>
              <span>•</span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>

            {/* Read More */}
            <div className="flex items-center gap-2 text-[#2563EB] group-hover:text-[#1D4ED8] font-medium text-sm transition-colors mt-auto">
              <span>Ler mais</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}