interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  return (
    <article className="bg-slate-50 rounded-2xl p-8 md:p-12 shadow-md border border-slate-200/60 max-w-none">
      <div className="blog-content text-slate-600 leading-relaxed max-w-none font-sans">
        {children}
      </div>
    </article>
  );
}