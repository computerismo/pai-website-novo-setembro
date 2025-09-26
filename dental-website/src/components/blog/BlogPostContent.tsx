interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  return (
    <article className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200/50 max-w-none">
      <div className="blog-content text-gray-800 leading-relaxed text-lg max-w-none">
        {children}
      </div>
    </article>
  );
}