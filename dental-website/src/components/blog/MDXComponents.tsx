import { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Custom components for MDX
const components: MDXComponents = {
  // Override default HTML elements
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8 leading-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6 leading-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="text-lg text-gray-800 mb-4 leading-relaxed font-[var(--font-crimson-pro)]" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="text-gray-800 mb-4 space-y-2 font-[var(--font-crimson-pro)] pl-5" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="text-gray-800 mb-4 space-y-2 font-[var(--font-crimson-pro)] pl-5" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-lg text-gray-800 font-[var(--font-crimson-pro)] marker:text-gray-800" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-sky-500 pl-6 py-2 bg-gray-50 rounded-r-lg mb-6 italic text-gray-800 font-[var(--font-crimson-pro)]" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6" {...props}>
      {children}
    </pre>
  ),
  a: ({ children, href, ...props }) => {
    // Internal links
    if (href && href.startsWith('/')) {
      return (
        <Link href={href} className="text-sky-600 hover:text-sky-700 underline" {...props}>
          {children}
        </Link>
      );
    }
    // External links
    return (
      <a
        href={href}
        className="text-sky-600 hover:text-sky-700 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...props }) => (
    <div className="my-8">
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-lg w-full"
        {...props}
      />
      {alt && (
        <p className="text-sm text-gray-500 text-center mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border border-gray-200 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b border-gray-200" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2 text-sm text-gray-800 border-b border-gray-100" {...props}>
      {children}
    </td>
  ),
  hr: ({ ...props }) => (
    <hr className="border-gray-200 my-8" {...props} />
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // Custom components
  CallToAction: ({ children, href, variant = 'primary' }: {
    children: React.ReactNode;
    href: string;
    variant?: 'primary' | 'secondary';
  }) => (
    <div className="my-8 text-center">
      <Button asChild size="lg" variant={variant === 'primary' ? 'primary' : 'outline'}>
        <Link href={href}>
          {children}
        </Link>
      </Button>
    </div>
  ),

  InfoBox: ({ children, type = 'info' }: {
    children: React.ReactNode;
    type?: 'info' | 'warning' | 'success' | 'error';
  }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
    };

    return (
      <div className={`border-l-4 p-4 my-6 rounded-r-lg ${styles[type]}`}>
        {children}
      </div>
    );
  },

  Highlight: ({ children }: { children: React.ReactNode }) => (
    <mark className="bg-yellow-200 px-1 rounded">
      {children}
    </mark>
  ),

  TreatmentCard: ({ title, description, link }: {
    title: string;
    description: string;
    link?: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow my-6">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {link && (
        <Button asChild variant="outline" size="sm">
          <Link href={link}>
            Saiba Mais
          </Link>
        </Button>
      )}
    </div>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}

export default components;