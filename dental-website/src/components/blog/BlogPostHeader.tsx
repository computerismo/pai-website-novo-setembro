import { BlogPost } from '@/lib/blog/posts';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 mb-12 rounded-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl translate-y-32 -translate-x-32"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">


          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-center">
            {post.title}
          </h1>

          {/* Excerpt */}


          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="font-medium">{post.author}</span>
            </div>
            <span className="hidden sm:block">•</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </time>
            </div>
            <span className="hidden sm:block">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </header>
  );
}