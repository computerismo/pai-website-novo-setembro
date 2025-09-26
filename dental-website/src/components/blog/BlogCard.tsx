import Link from 'next/link';
import { BlogPost } from '@/lib/blog/posts';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article className="group h-full">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className={`bg-white rounded-xl border-2 p-6 h-full flex flex-col transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-100/50 group-hover:-translate-y-1 ${
          featured ? 'border-blue-300 shadow-md shadow-blue-50' : 'border-gray-200 hover:border-blue-300'
        }`}>
          {/* Category */}
          <div className="mb-4">
            <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <time dateTime={post.date}>
              {format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
            </time>
            <span>•</span>
            <span>{post.readingTime}</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>

          {/* Read More */}
          <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium text-sm transition-colors">
            <span>Ler mais</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}