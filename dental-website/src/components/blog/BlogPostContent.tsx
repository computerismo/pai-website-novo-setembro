interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  return (
    <article className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200/50 max-w-none">
      <div className="blog-content text-gray-900 leading-7 max-w-none font-[var(--font-crimson-pro)]">
        {children}
      </div>
    </article>
  );
}