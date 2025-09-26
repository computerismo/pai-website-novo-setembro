interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  return (
    <div className="prose prose-lg max-w-none prose-gray prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
      {children}
    </div>
  );
}