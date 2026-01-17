import { BlogPost } from '@/lib/blog/posts';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NextImage from 'next/image';

interface BlogPostHeaderProps {
  post: BlogPost;
  image?: string;
}

export function BlogPostHeader({ post, image }: BlogPostHeaderProps) {
  return (
    <header className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 mb-12 rounded-2xl overflow-hidden min-h-[400px] flex flex-col justify-center border border-gray-100/50">
      {/* Background Image with Overlay */}
      {image && image !== '/images/blog/default.jpg' && (
        <div className="absolute inset-0 z-0">
          <NextImage
            src={image}
            alt=""
            fill
            className="object-cover opacity-[0.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/80 to-white/90 backdrop-blur-[2px]"></div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl translate-y-32 -translate-x-32"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">


          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight text-center tracking-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-[10px] font-bold">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-gray-700">{post.author}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <time dateTime={post.date} className="text-gray-600">
                {format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
              </time>
            </div>
            
            <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
              <Clock className="w-4 h-4 text-teal-500" />
              <span className="text-gray-600">{post.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent"></div>
    </header>
  );
}